package com.eqsb.ui

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.eqsb.ui.screens.*
import com.eqsb.ui.theme.BgDark
import com.eqsb.ui.theme.EQsbTheme
import com.eqsb.ui.theme.SurfaceDark
import com.eqsb.ui.theme.AccentCyan
import com.eqsb.viewmodel.EQsbViewModel

class MainActivity : ComponentActivity() {

    private val viewModel: EQsbViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        setContent {
            EQsbTheme {
                MainAppScaffold(viewModel = viewModel)
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MainAppScaffold(viewModel: EQsbViewModel) {
    var selectedTab by remember { mutableStateOf(0) }

    val tabTitles = listOf("Dashboard", "EQ32", "Dynamics", "Tone & FX", "Output", "Presets", "Audit", "Settings")

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text("EQsb — Real C++ DSP Audio Engine", style = MaterialTheme.typography.titleLarge)
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = SurfaceDark,
                    titleContentColor = AccentCyan
                )
            )
        },
        bottomBar = {
            ScrollableTabRow(
                selectedTabIndex = selectedTab,
                containerColor = SurfaceDark,
                contentColor = AccentCyan,
                edgePadding = 8.dp
            ) {
                tabTitles.forEachIndexed { index, title ->
                    Tab(
                        selected = selectedTab == index,
                        onClick = { selectedTab = index },
                        text = { Text(title, style = MaterialTheme.typography.labelSmall) }
                    )
                }
            }
        },
        containerColor = BgDark
    ) { innerPadding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
        ) {
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
