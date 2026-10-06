package com.eqsb.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.eqsb.core.AudioBackendType
import com.eqsb.ui.theme.*
import com.eqsb.viewmodel.EQsbViewModel

@Composable
fun SettingsScreen(viewModel: EQsbViewModel) {
    val config by viewModel.config.collectAsState()

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(BgDark)
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            Text(
                text = "AUDIO BACKEND CONFIGURATION",
                style = MaterialTheme.typography.titleMedium,
                color = AccentCyan
            )
            Text(
                text = "Both backends use the identical native C++ EQsbDspEngine.",
                style = MaterialTheme.typography.labelSmall,
                color = TextSecondary
            )
        }

        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = SurfaceDark),
                shape = RoundedCornerShape(12.dp)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text(
                        text = "ACTIVE BACKEND",
                        style = MaterialTheme.typography.bodyMedium,
                        color = AccentAmber
                    )
                    Spacer(modifier = Modifier.height(12.dp))

                    AudioBackendType.values().forEach { backend ->
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(vertical = 4.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            RadioButton(
                                selected = config.backendType == backend,
                                onClick = { viewModel.setBackendType(backend) },
                                colors = RadioButtonDefaults.colors(selectedColor = AccentCyan)
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Column {
                                Text(backend.displayName, style = MaterialTheme.typography.bodyLarge)
                                Text(backend.description, style = MaterialTheme.typography.labelSmall, color = TextMuted)
                            }
                        }
                    }
                }
            }
        }

        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = SurfaceDark),
                shape = RoundedCornerShape(12.dp)
            ) {
                Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text("ENGINE SPECIFICATIONS", style = MaterialTheme.typography.titleMedium, color = AccentCyan)
                    Divider(color = CardBorderDark)
                    InfoRow("DSP Core Language", "C++17 (Native CMake)")
                    InfoRow("JNI Bridge Package", "com.eqsb.jni.EQsbNativeDsp")
                    InfoRow("Equalizer Topology", "32 RBJ Biquads (Direct Form II Transposed)")
                    InfoRow("Processing Format", "32-Bit IEEE Floating Point PCM")
                    InfoRow("Sampling Rates", "44.1 kHz, 48.0 kHz, 96.0 kHz")
                    InfoRow("Buffer Performance", "Zero heap allocations in audio loop")
                    InfoRow("Target Platform", "Android API 24+ (minSdk 24, targetSdk 34)")
                }
            }
        }
    }
}

@Composable
fun InfoRow(label: String, value: String) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Text(label, style = MaterialTheme.typography.bodyMedium, color = TextSecondary)
        Text(value, style = MaterialTheme.typography.bodyMedium, color = TextPrimary)
    }
}
