package com.eqsb.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.eqsb.ui.theme.*
import com.eqsb.viewmodel.EQsbViewModel

@Composable
fun ToneEffectsScreen(viewModel: EQsbViewModel) {
    val config by viewModel.config.collectAsState()

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(BgDark)
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Bass Boost Card
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = SurfaceDark),
                shape = RoundedCornerShape(12.dp)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text(
                                text = "BASS BOOST",
                                style = MaterialTheme.typography.titleMedium,
                                color = AccentCyan
                            )
                            Text(
                                text = "80 Hz Low-Shelf Sub-Bass Resonance",
                                style = MaterialTheme.typography.labelSmall,
                                color = TextSecondary
                            )
                        }
                        Switch(
                            checked = config.bassBoostEnabled,
                            onCheckedChange = { viewModel.setBassBoost(it, config.bassBoostStrength) },
                            colors = SwitchDefaults.colors(checkedThumbColor = AccentCyan)
                        )
                    }

                    Spacer(modifier = Modifier.height(12.dp))
                    Text(
                        text = "Strength: ${(config.bassBoostStrength * 100).toInt()}% (+${String.format("%.1f", config.bassBoostStrength * 12f)} dB)",
                        style = MaterialTheme.typography.bodyMedium,
                        color = TextPrimary
                    )
                    Slider(
                        value = config.bassBoostStrength,
                        onValueChange = { viewModel.setBassBoost(config.bassBoostEnabled, it) },
                        valueRange = 0.0f..1.0f,
                        enabled = config.bassBoostEnabled
                    )
                }
            }
        }

        // 3-Band Tone Control Card
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = SurfaceDark),
                shape = RoundedCornerShape(12.dp)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text(
                                text = "TONE CONTROL",
                                style = MaterialTheme.typography.titleMedium,
                                color = AccentPurple
                            )
                            Text(
                                text = "Bass (200Hz) / Mid (1kHz) / Treble (5kHz)",
                                style = MaterialTheme.typography.labelSmall,
                                color = TextSecondary
                            )
                        }
                        Switch(
                            checked = config.toneEnabled,
                            onCheckedChange = {
                                viewModel.setTone(it, config.toneBassDb, config.toneMidDb, config.toneTrebleDb)
                            },
                            colors = SwitchDefaults.colors(checkedThumbColor = AccentPurple)
                        )
                    }

                    Spacer(modifier = Modifier.height(16.dp))

                    // Bass
                    Text("Bass (200 Hz Low Shelf): ${String.format("%+.1f", config.toneBassDb)} dB", style = MaterialTheme.typography.bodyMedium)
                    Slider(
                        value = config.toneBassDb,
                        onValueChange = { viewModel.setTone(config.toneEnabled, it, config.toneMidDb, config.toneTrebleDb) },
                        valueRange = -12f..12f,
                        enabled = config.toneEnabled
                    )

                    // Mid
                    Text("Mid (1000 Hz Peaking): ${String.format("%+.1f", config.toneMidDb)} dB", style = MaterialTheme.typography.bodyMedium)
                    Slider(
                        value = config.toneMidDb,
                        onValueChange = { viewModel.setTone(config.toneEnabled, config.toneBassDb, it, config.toneTrebleDb) },
                        valueRange = -12f..12f,
                        enabled = config.toneEnabled
                    )

                    // Treble
                    Text("Treble (5000 Hz High Shelf): ${String.format("%+.1f", config.toneTrebleDb)} dB", style = MaterialTheme.typography.bodyMedium)
                    Slider(
                        value = config.toneTrebleDb,
                        onValueChange = { viewModel.setTone(config.toneEnabled, config.toneBassDb, config.toneMidDb, it) },
                        valueRange = -12f..12f,
                        enabled = config.toneEnabled
                    )
                }
            }
        }

        // Spatial Virtualizer Card
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = SurfaceDark),
                shape = RoundedCornerShape(12.dp)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text(
                                text = "SPATIAL / VIRTUALIZER",
                                style = MaterialTheme.typography.titleMedium,
                                color = AccentBlue
                            )
                            Text(
                                text = "Mid/Side Stereo Soundstage Expansion & Cross-Feed",
                                style = MaterialTheme.typography.labelSmall,
                                color = TextSecondary
                            )
                        }
                        Switch(
                            checked = config.spatialEnabled,
                            onCheckedChange = { viewModel.setSpatial(it, config.spatialWidth) },
                            colors = SwitchDefaults.colors(checkedThumbColor = AccentBlue)
                        )
                    }

                    Spacer(modifier = Modifier.height(12.dp))
                    Text(
                        text = "Soundstage Width: ${(config.spatialWidth * 100).toInt()}%",
                        style = MaterialTheme.typography.bodyMedium,
                        color = TextPrimary
                    )
                    Slider(
                        value = config.spatialWidth,
                        onValueChange = { viewModel.setSpatial(config.spatialEnabled, it) },
                        valueRange = 0.0f..1.0f,
                        enabled = config.spatialEnabled
                    )
                }
            }
        }
    }
}
