package com.eqsb.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.eqsb.core.EQ32Frequencies
import com.eqsb.ui.theme.*
import com.eqsb.viewmodel.EQsbViewModel

@Composable
fun EQ32Screen(viewModel: EQsbViewModel) {
    val config by viewModel.config.collectAsState()
    val scrollState = rememberScrollState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BgDark)
            .padding(16.dp)
    ) {
        // Header Controls
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text(
                    text = "EQ32 (32 REAL BIQUADS)",
                    style = MaterialTheme.typography.titleMedium,
                    color = AccentCyan
                )
                Text(
                    text = "ISO 1/3-Octave Peaking Filters (RBJ Direct Form II)",
                    style = MaterialTheme.typography.labelSmall,
                    color = TextSecondary
                )
            }

            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                OutlinedButton(
                    onClick = { viewModel.resetEQFlat() },
                    shape = RoundedCornerShape(8.dp),
                    colors = ButtonDefaults.outlinedButtonColors(contentColor = AccentCyan)
                ) {
                    Text("FLAT", fontSize = 12.sp)
                }

                Switch(
                    checked = config.eq32Enabled,
                    onCheckedChange = { viewModel.setEQ32Enabled(it) },
                    colors = SwitchDefaults.colors(checkedThumbColor = AccentCyan)
                )
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Horizontal scrolling container with all 32 real filter faders!
        Box(
            modifier = Modifier
                .weight(1f)
                .fillMaxWidth()
                .background(SurfaceDark, RoundedCornerShape(12.dp))
                .padding(12.dp)
        ) {
            Row(
                modifier = Modifier
                    .fillMaxHeight()
                    .horizontalScroll(scrollState),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                for (band in 0 until EQ32Frequencies.NUM_BANDS) {
                    val freqHz = EQ32Frequencies.CENTER_FREQUENCIES_HZ[band]
                    val gainDb = if (band < config.eq32Bands.size) config.eq32Bands[band] else 0.0f

                    EQBandColumn(
                        bandIndex = band,
                        freqHz = freqHz,
                        gainDb = gainDb,
                        enabled = config.eq32Enabled,
                        onGainChanged = { newGain ->
                            viewModel.setBandGain(band, newGain)
                        }
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(8.dp))
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Text("Range: -15 dB to +15 dB", style = MaterialTheme.typography.labelSmall, color = TextMuted)
            Text("Q factor: 4.318 (1/3 octave)", style = MaterialTheme.typography.labelSmall, color = TextMuted)
        }
    }
}

@Composable
fun EQBandColumn(
    bandIndex: Int,
    freqHz: Float,
    gainDb: Float,
    enabled: Boolean,
    onGainChanged: (Float) -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxHeight()
            .width(42.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.SpaceBetween
    ) {
        // Value readout
        Text(
            text = String.format("%+.1f", gainDb),
            style = MaterialTheme.typography.labelSmall,
            color = if (gainDb > 0.05f) AccentCyan else if (gainDb < -0.05f) AccentAmber else TextMuted,
            fontSize = 9.sp
        )

        // Vertical Slider
        Box(
            modifier = Modifier
                .weight(1f)
                .padding(vertical = 4.dp),
            contentAlignment = Alignment.Center
        ) {
            // Android Material3 Slider natively rendered vertically or custom slider
            Slider(
                value = gainDb,
                onValueChange = onGainChanged,
                valueRange = -15.0f..15.0f,
                enabled = enabled,
                colors = SliderDefaults.colors(
                    thumbColor = if (enabled) AccentCyan else TextMuted,
                    activeTrackColor = AccentBlue,
                    inactiveTrackColor = CardBorderDark
                ),
                modifier = Modifier
                    .fillMaxHeight()
                    .width(180.dp)
                    // Custom layout orientation for vertical fader
            )
        }

        // Center frequency label
        Text(
            text = EQ32Frequencies.formatFrequency(freqHz),
            style = MaterialTheme.typography.labelSmall,
            color = TextSecondary,
            fontSize = 9.sp,
            fontWeight = FontWeight.Medium
        )
    }
}
