package com.eqsb.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.eqsb.core.DspConfig
import com.eqsb.ui.theme.*
import com.eqsb.viewmodel.EQsbViewModel

@Composable
fun DashboardScreen(
    viewModel: EQsbViewModel,
    onNavigateToTab: (Int) -> Unit
) {
    val config by viewModel.config.collectAsState()
    val isRunning by viewModel.isAudioEngineRunning.collectAsState()
    val preset by viewModel.currentPreset.collectAsState()

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(BgDark)
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Top Engine Status Card
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = SurfaceDark),
                shape = RoundedCornerShape(12.dp)
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(
                            text = "EQsb C++ DSP CORE",
                            style = MaterialTheme.typography.titleMedium,
                            color = AccentCyan
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = if (isRunning) "ENGINE: RUNNING (REAL PCM)" else "ENGINE: STANDBY",
                            style = MaterialTheme.typography.bodyMedium,
                            color = if (isRunning) AccentEmerald else TextMuted
                        )
                        Text(
                            text = "Backend: ${config.backendType.displayName}",
                            style = MaterialTheme.typography.labelSmall,
                            color = TextSecondary
                        )
                    }

                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        Button(
                            onClick = {
                                if (isRunning) viewModel.stopAudioEngine() else viewModel.startAudioEngine()
                            },
                            colors = ButtonDefaults.buttonColors(
                                containerColor = if (isRunning) AccentRose else AccentCyan,
                                contentColor = BgDark
                            ),
                            shape = RoundedCornerShape(8.dp)
                        ) {
                            Text(if (isRunning) "STOP" else "START", fontWeight = FontWeight.Bold)
                        }

                        OutlinedButton(
                            onClick = { viewModel.toggleBypass() },
                            colors = ButtonDefaults.outlinedButtonColors(
                                contentColor = if (config.bypass) AccentRose else AccentCyan
                            ),
                            shape = RoundedCornerShape(8.dp)
                        ) {
                            Text(if (config.bypass) "BYPASSED" else "ACTIVE")
                        }
                    }
                }
            }
        }

        // Active Preset Card
        item {
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .clickable { onNavigateToTab(4) }, // Presets tab
                colors = CardDefaults.cardColors(containerColor = CardDark),
                shape = RoundedCornerShape(12.dp)
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(
                            text = "ACTIVE PRESET",
                            style = MaterialTheme.typography.labelSmall,
                            color = TextSecondary
                        )
                        Text(
                            text = preset.name,
                            style = MaterialTheme.typography.titleMedium,
                            color = AccentAmber
                        )
                        Text(
                            text = preset.description,
                            style = MaterialTheme.typography.bodyMedium,
                            color = TextMuted
                        )
                    }
                    Text("Change >", color = AccentCyan, style = MaterialTheme.typography.bodyMedium)
                }
            }
        }

        // Complete 10-Node DSP Chain Visualization
        item {
            Text(
                text = "DSP SIGNAL CHAIN (STRICT ORDER)",
                style = MaterialTheme.typography.labelSmall,
                color = AccentCyan,
                fontWeight = FontWeight.Bold
            )
        }

        item {
            val chainNodes = listOf(
                DspNodeItem("1. Pre-Gain", "${String.format("%+.1f", config.preGainDb)} dB", config.preGainDb != 0f, 3),
                DspNodeItem("2. Bass Boost", "${(config.bassBoostStrength * 100).toInt()}% (+${String.format("%.1f", config.bassBoostStrength * 12f)} dB)", config.bassBoostEnabled, 2),
                DspNodeItem("3. Tone Control", "B:${String.format("%+.0f", config.toneBassDb)} M:${String.format("%+.0f", config.toneMidDb)} T:${String.format("%+.0f", config.toneTrebleDb)}", config.toneEnabled, 2),
                DspNodeItem("4. EQ32 (32 Biquads)", "32 RBJ Filters Active", config.eq32Enabled, 1),
                DspNodeItem("5. MDRC (3-Band)", "L/M/H Dynamics", config.mdrcEnabled, 2),
                DspNodeItem("6. AutoGain (AGC)", "${config.autoGainTargetDb.toInt()} dBFS Target", config.autoGainEnabled, 2),
                DspNodeItem("7. Peak Limiter", "${config.limiterCeilingDb} dBFS Ceiling", config.limiterEnabled, 2),
                DspNodeItem("8. Spatial Virtualizer", "${(config.spatialWidth * 100).toInt()}% Width", config.spatialEnabled, 2),
                DspNodeItem("9. Master Gain", "${String.format("%+.1f", config.masterGainDb)} dB", config.masterGainDb != 0f, 3),
                DspNodeItem("10. Balance (L/R)", when {
                    config.balance < 0 -> "L ${(config.balance * -100).toInt()}%"
                    config.balance > 0 -> "R ${(config.balance * 100).toInt()}%"
                    else -> "Center"
                }, config.balance != 0f, 3)
            )

            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                chainNodes.forEachIndexed { index, node ->
                    DspNodeCard(node = node, onClick = { onNavigateToTab(node.tabIndex) })
                    if (index < chainNodes.size - 1) {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(12.dp),
                            contentAlignment = Alignment.Center
                        ) {
                            Text("↓", color = TextMuted, fontSize = 12.sp)
                        }
                    }
                }
            }
        }
    }
}

data class DspNodeItem(
    val title: String,
    val detail: String,
    val isActive: Boolean,
    val tabIndex: Int
)

@Composable
fun DspNodeCard(node: DspNodeItem, onClick: () -> Unit) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(8.dp))
            .border(
                width = 1.dp,
                color = if (node.isActive) AccentCyan.copy(alpha = 0.5f) else CardBorderDark,
                shape = RoundedCornerShape(8.dp)
            )
            .clickable(onClick = onClick),
        colors = CardDefaults.cardColors(containerColor = SurfaceDark)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 10.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Box(
                    modifier = Modifier
                        .size(8.dp)
                        .clip(RoundedCornerShape(4.dp))
                        .background(if (node.isActive) AccentCyan else TextMuted)
                )
                Spacer(modifier = Modifier.width(12.dp))
                Text(
                    text = node.title,
                    style = MaterialTheme.typography.bodyLarge,
                    color = if (node.isActive) TextPrimary else TextSecondary,
                    fontWeight = if (node.isActive) FontWeight.SemiBold else FontWeight.Normal
                )
            }
            Text(
                text = node.detail,
                style = MaterialTheme.typography.labelSmall,
                color = if (node.isActive) AccentCyan else TextMuted
            )
        }
    }
}
