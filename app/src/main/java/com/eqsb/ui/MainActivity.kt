package com.eqsb.ui

import android.app.Activity
import android.content.*
import android.media.AudioManager
import android.media.projection.MediaProjection
import android.media.projection.MediaProjectionManager
import android.os.Bundle
import android.os.IBinder
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.result.contract.ActivityResultContracts
import androidx.activity.viewModels
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import com.eqsb.backend.AudioEffectAudioBackend
import com.eqsb.service.EQsbAudioService
import com.eqsb.ui.screens.*
import com.eqsb.ui.theme.*
import com.eqsb.viewmodel.EQsbViewModel

class MainActivity : ComponentActivity() {

    private val viewModel: EQsbViewModel by viewModels()
    private var audioService: EQsbAudioService? = null
    private var mediaProjection: MediaProjection? = null

    private val projectionManager by lazy {
        getSystemService(Context.MEDIA_PROJECTION_SERVICE) as MediaProjectionManager
    }

    private val serviceConnection = object : ServiceConnection {
        override fun onServiceConnected(name: ComponentName?, binder: IBinder?) {
            val local = binder as EQsbAudioService.LocalBinder
            audioService = local.getService()
            mediaProjection?.let { mp -> audioService?.injectMediaProjection(mp) }
        }
        override fun onServiceDisconnected(name: ComponentName?) { audioService = null }
    }

    private val projectionLauncher = registerForActivityResult(
        ActivityResultContracts.StartActivityForResult()
    ) { result ->
        if (result.resultCode == Activity.RESULT_OK && result.data != null) {
            val mp = projectionManager.getMediaProjection(result.resultCode, result.data!!)
            mediaProjection = mp
            audioService?.injectMediaProjection(mp)
            val am = getSystemService(Context.AUDIO_SERVICE) as AudioManager
            am.setStreamVolume(AudioManager.STREAM_MUSIC, 0, 0)
        }
    }

    fun requestProjection() {
        projectionLauncher.launch(projectionManager.createScreenCaptureIntent())
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        bindService(Intent(this, EQsbAudioService::class.java), serviceConnection, Context.BIND_AUTO_CREATE)
        setContent {
            EQsbTheme {
                MainAppScaffold(viewModel = viewModel)
            }
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        try { unbindService(serviceConnection) } catch (_: Exception) {}
        mediaProjection?.stop()
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MainAppScaffold(viewModel: EQsbViewModel) {
    var selectedTab by remember { mutableStateOf(0) }
    val tabTitles = listOf("Dashboard", "EQ32", "Dynamics", "Tone & FX", "Output", "Presets", "Audit", "Settings")
    val context = LocalContext.current

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("EQsb — Real C++ DSP Audio Engine", style = MaterialTheme.typography.titleLarge) },
                actions = {
                    TextButton(onClick = { (context as? MainActivity)?.requestProjection() }) {
                        Text("EQ YouTube/Spotify", color = AccentCyan)
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = SurfaceDark, titleContentColor = AccentCyan)
            )
        },
        bottomBar = {
            ScrollableTabRow(selectedTabIndex = selectedTab, containerColor = SurfaceDark, contentColor = AccentCyan, edgePadding = 8.dp) {
                tabTitles.forEachIndexed { index, title ->
                    Tab(selected = selectedTab == index, onClick = { selectedTab = index }, text = { Text(title, style = MaterialTheme.typography.labelSmall) })
                }
            }
        },
        containerColor = BgDark
    ) { innerPadding ->
        Box(modifier = Modifier.fillMaxSize().padding(innerPadding)) {
            when (selectedTab) {
                0 -> DashboardScreen(viewModel = viewModel, onNavigateToTab = { selectedTab = it })
                1 -> EQ32Screen(viewModel = viewModel)
                2 -> DynamicsScreen(viewModel = viewModel)
                3 -> ToneEffectsScreen(viewModel = viewModel)
                4 -> OutputScreen(viewModel = viewModel)
                5 -> PresetsScreen(viewModel = viewModel)
                6 -> AuditScreen(viewModel = viewModel)
                7 -> SettingsScreen(viewModel = viewModel)
            }
        }
    }
}
