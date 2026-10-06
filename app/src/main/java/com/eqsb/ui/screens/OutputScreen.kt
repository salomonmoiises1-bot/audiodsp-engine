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
import com.eqsb.ui.theme.*
import com.eqsb.viewmodel.EQsbViewModel

@Composable
fun OutputScreen(viewModel: EQsbViewModel) {
    val config by viewModel.config.collectAsState()

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(BgDark)
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Pre-Gain Card
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = SurfaceDark),
                shape = RoundedCornerShape(12.dp)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text(
                        text = "PRE-GAIN (INPUT ATTENUATION / BOOST)",
                        style = MaterialTheme.typography.titleMedium,
                        color = AccentCyan
                    )
                    Text(
                        text = "Scales input PCM before entering filter bank & dynamics.",
                        style = MaterialTheme.typography.labelSmall,
                        color = TextSecondary
                    )
                    Spacer(modifier = Modifier.height(12.dp))
                    Text(
                        text = "Pre-Gain: ${String.format("%+.1f", config.preGainDb)} dB",
                        style = MaterialTheme.typography.bodyMedium,
                        color = TextPrimary
                    )
                    Slider(
                        value = config.preGainDb,
                        onValueChange = { viewModel.setPreGain(it) },
                        valueRange = -24.0f..24.0f
                    )
                }
            }
        }

        // Master Gain Card
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = SurfaceDark),
                shape = RoundedCornerShape(12.dp)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text(
                        text = "MASTER GAIN",
                        style = MaterialTheme.typography.titleMedium,
                        color = AccentEmerald
                    )
                    Text(
                        text = "Final volume stage applied to processed PCM.",
                        style = MaterialTheme.typography.labelSmall,
                        color = TextSecondary
                    )
                    Spacer(modifier = Modifier.height(12.dp))
                    Text(
                        text = "Master Gain: ${String.format("%+.1f", config.masterGainDb)} dB",
                        style = MaterialTheme.typography.bodyMedium,
                        color = TextPrimary
                    )
                    Slider(
                        value = config.masterGainDb,
                        onValueChange = { viewModel.setMasterGain(it) },
                        valueRange = -48.0f..12.0f
                    )
                }
            }
        }

        // Balance Card
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = SurfaceDark),
                shape = RoundedCornerShape(12.dp)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text(
                        text = "STEREO BALANCE",
                        style = MaterialTheme.typography.titleMedium,
                        color = AccentAmber
                    )
                    Text(
                        text = "Left / Right channel pan law attenuation.",
                        style = MaterialTheme.typography.labelSmall,
                        color = TextSecondary
                    )
                    Spacer(modifier = Modifier.height(12.dp))
                    Text(
                        text = when {
                            config.balance < -0.01f -> "Panned Left: ${(config.balance * -100).toInt()}%"
                            config.balance > 0.01f -> "Panned Right: ${(config.balance * 100).toInt()}%"
                            else -> "Center Balanced"
                        },
                        style = MaterialTheme.typography.bodyMedium,
                        color = TextPrimary
                    )
                    Slider(
                        value = config.balance,
                        onValueChange = { viewModel.setBalance(it) },
                        valueRange = -1.0f..1.0f
                    )
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text("Left (100%)", style = MaterialTheme.typography.labelSmall, color = TextMuted)
                        Text("Center", style = MaterialTheme.typography.labelSmall, color = TextMuted)
                        Text("Right (100%)", style = MaterialTheme.typography.labelSmall, color = TextMuted)
                    }
                }
            }
        }
    }
}
