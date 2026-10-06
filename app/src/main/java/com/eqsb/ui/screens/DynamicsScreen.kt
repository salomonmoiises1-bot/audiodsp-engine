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
fun DynamicsScreen(viewModel: EQsbViewModel) {
    val config by viewModel.config.collectAsState()

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(BgDark)
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // MDRC Section
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
                                text = "MDRC (MULTIBAND DYNAMICS)",
                                style = MaterialTheme.typography.titleMedium,
                                color = AccentCyan
                            )
                            Text(
                                text = "3-Band Crossover Compressor (<250Hz, 250-4kHz, >4kHz)",
                                style = MaterialTheme.typography.labelSmall,
                                color = TextSecondary
                            )
                        }
                        Switch(
                            checked = config.mdrcEnabled,
                            onCheckedChange = {
                                viewModel.setMdrcConfig(
                                    it,
                                    config.mdrcLowThresholdDb, config.mdrcLowRatio,
                                    config.mdrcMidThresholdDb, config.mdrcMidRatio,
                                    config.mdrcHighThresholdDb, config.mdrcHighRatio
                                )
                            },
                            colors = SwitchDefaults.colors(checkedThumbColor = AccentCyan)
                        )
                    }

                    Spacer(modifier = Modifier.height(16.dp))

                    // Low Band (<250 Hz)
                    Text("Low Band (< 250 Hz)", style = MaterialTheme.typography.bodyMedium, color = AccentBlue)
                    Text("Threshold: ${config.mdrcLowThresholdDb.toInt()} dB | Ratio: ${config.mdrcLowRatio}:1", style = MaterialTheme.typography.labelSmall, color = TextMuted)
                    Slider(
                        value = config.mdrcLowThresholdDb,
                        onValueChange = {
                            viewModel.setMdrcConfig(
                                config.mdrcEnabled,
                                it, config.mdrcLowRatio,
                                config.mdrcMidThresholdDb, config.mdrcMidRatio,
                                config.mdrcHighThresholdDb, config.mdrcHighRatio
                            )
                        },
                        valueRange = -40f..0f,
                        enabled = config.mdrcEnabled
                    )

                    Spacer(modifier = Modifier.height(8.dp))

                    // Mid Band (250 Hz - 4000 Hz)
                    Text("Mid Band (250 Hz - 4 kHz)", style = MaterialTheme.typography.bodyMedium, color = AccentPurple)
                    Text("Threshold: ${config.mdrcMidThresholdDb.toInt()} dB | Ratio: ${config.mdrcMidRatio}:1", style = MaterialTheme.typography.labelSmall, color = TextMuted)
                    Slider(
                        value = config.mdrcMidThresholdDb,
                        onValueChange = {
                            viewModel.setMdrcConfig(
                                config.mdrcEnabled,
                                config.mdrcLowThresholdDb, config.mdrcLowRatio,
                                it, config.mdrcMidRatio,
                                config.mdrcHighThresholdDb, config.mdrcHighRatio
                            )
                        },
                        valueRange = -40f..0f,
                        enabled = config.mdrcEnabled
                    )

                    Spacer(modifier = Modifier.height(8.dp))

                    // High Band (> 4000 Hz)
                    Text("High Band (> 4 kHz)", style = MaterialTheme.typography.bodyMedium, color = AccentCyan)
                    Text("Threshold: ${config.mdrcHighThresholdDb.toInt()} dB | Ratio: ${config.mdrcHighRatio}:1", style = MaterialTheme.typography.labelSmall, color = TextMuted)
                    Slider(
                        value = config.mdrcHighThresholdDb,
                        onValueChange = {
                            viewModel.setMdrcConfig(
                                config.mdrcEnabled,
                                config.mdrcLowThresholdDb, config.mdrcLowRatio,
                                config.mdrcMidThresholdDb, config.mdrcMidRatio,
                                it, config.mdrcHighRatio
                            )
                        },
                        valueRange = -40f..0f,
                        enabled = config.mdrcEnabled
                    )
                }
            }
        }

        // AutoGain (AGC) Section
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
                                text = "AUTOGAIN (RMS AGC)",
                                style = MaterialTheme.typography.titleMedium,
                                color = AccentAmber
                            )
                            Text(
                                text = "Automatic Loudness Leveler / Energy Follower",
                                style = MaterialTheme.typography.labelSmall,
                                color = TextSecondary
                            )
                        }
                        Switch(
                            checked = config.autoGainEnabled,
                            onCheckedChange = { viewModel.setAutoGain(it, config.autoGainTargetDb) },
                            colors = SwitchDefaults.colors(checkedThumbColor = AccentAmber)
                        )
                    }

                    Spacer(modifier = Modifier.height(12.dp))
                    Text("Target Level: ${config.autoGainTargetDb.toInt()} dBFS", style = MaterialTheme.typography.bodyMedium, color = TextPrimary)
                    Slider(
                        value = config.autoGainTargetDb,
                        onValueChange = { viewModel.setAutoGain(config.autoGainEnabled, it) },
                        valueRange = -30f..-6f,
                        enabled = config.autoGainEnabled
                    )
                }
            }
        }

        // Limiter Section
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
                                text = "BRICKWALL PEAK LIMITER",
                                style = MaterialTheme.typography.titleMedium,
                                color = AccentEmerald
                            )
                            Text(
                                text = "True Peak Ceiling Protection & Anti-Clipping",
                                style = MaterialTheme.typography.labelSmall,
                                color = TextSecondary
                            )
                        }
                        Switch(
                            checked = config.limiterEnabled,
                            onCheckedChange = { viewModel.setLimiter(it, config.limiterCeilingDb) },
                            colors = SwitchDefaults.colors(checkedThumbColor = AccentEmerald)
                        )
                    }

                    Spacer(modifier = Modifier.height(12.dp))
                    Text("Ceiling: ${String.format("%.1f", config.limiterCeilingDb)} dBFS", style = MaterialTheme.typography.bodyMedium, color = TextPrimary)
                    Slider(
                        value = config.limiterCeilingDb,
                        onValueChange = { viewModel.setLimiter(config.limiterEnabled, it) },
                        valueRange = -12f..0f,
                        enabled = config.limiterEnabled
                    )
                }
            }
        }
    }
}
