package com.eqsb.ui

import android.app.Activity
import android.content.*
import android.media.AudioManager
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
            val local = binder as? EQsbAudioService.LocalBinder
            audioService = local?.getService()
            // Si ya teníamos proyección, inyectala
            mediaProjection?.let { mp ->
                (audioService?.getBackend() as? AudioEffectAudioBackend)?.setMediaProjection(mp)
            }
        }
        override fun onServiceDisconnected(name: ComponentName?) { audioService = null }
    }

    private val projectionLauncher = registerForActivityResult(
        ActivityResultContracts.StartActivityForResult()
    ) { result ->
        if (result.resultCode == Activity.RESULT_OK) {
            val mp = projectionManager.getMediaProjection(result.resultCode, result.data!!)
            mediaProjection = mp
            // Inyectar a tu backend sin romper DspConfigRepository
            (audioService?.getBackend() as? AudioEffectAudioBackend)?.setMediaProjection(mp)

            // Mutear el YouTube original para que solo escuches la copia ecualizada por GAME
            val am = getSystemService(Context.AUDIO_SERVICE) as AudioManager
            am.setStreamVolume(AudioManager.STREAM_MUSIC, 0, 0)

            // Opcional: avisar a ViewModel para que muestre estado
            viewModel.onProjectionGranted()
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Bind al servicio que ya usa tu ViewModel
        bindService(
            Intent(this, EQsbAudioService::class.java),
            serviceConnection,
            Context.BIND_AUTO_CREATE
        )

        setContent {
            EQsbTheme {
                MainAppScaffold(
                    viewModel = viewModel,
                    onRequestCapture = { projectionLauncher.launch(projectionManager.createScreenCaptureIntent()) }
                )
            }
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        unbindService(serviceConnection)
        mediaProjection?.stop()
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MainAppScaffold(viewModel: EQsbViewModel, onRequestCapture: () -> Unit) {
    var selectedTab by remember { mutableStateOf(0) }
    val tabTitles = listOf("Dashboard", "EQ32", "Dynamics", "Tone & FX", "Output", "Presets", "Audit", "Settings")

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("EQsb — Real C++ DSP Audio Engine", style = MaterialTheme.typography.titleLarge) },
                actions = {
                    // Botón que no rompe nada, solo pide permiso para YouTube/Spotify/AIMP
                    TextButton(onClick = onRequestCapture) {
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
