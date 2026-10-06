package com.eqsb.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.eqsb.core.Preset
import com.eqsb.core.Presets
import com.eqsb.ui.theme.*
import com.eqsb.viewmodel.EQsbViewModel

@Composable
fun PresetsScreen(viewModel: EQsbViewModel) {
    val currentPreset by viewModel.currentPreset.collectAsState()

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(BgDark)
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        item {
            Text(
                text = "DSP ENGINE PRESETS",
                style = MaterialTheme.typography.titleMedium,
                color = AccentCyan
            )
            Text(
                text = "Each preset restores the complete C++ engine state (all 32 biquads, dynamics, gains, and effects).",
                style = MaterialTheme.typography.labelSmall,
                color = TextSecondary
            )
            Spacer(modifier = Modifier.height(4.dp))
        }

        items(Presets.FACTORY_PRESETS) { preset ->
            val isSelected = currentPreset.id == preset.id

            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(10.dp))
                    .border(
                        width = if (isSelected) 1.5.dp else 1.dp,
                        color = if (isSelected) AccentCyan else CardBorderDark,
                        shape = RoundedCornerShape(10.dp)
                    )
                    .clickable { viewModel.loadPreset(preset) },
                colors = CardDefaults.cardColors(
                    containerColor = if (isSelected) SurfaceDark else CardDark
                )
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = preset.name,
                            style = MaterialTheme.typography.titleMedium,
                            color = if (isSelected) AccentCyan else TextPrimary,
                            fontWeight = FontWeight.Bold
                        )
                        Box(
                            modifier = Modifier
                                .background(CardBorderDark, RoundedCornerShape(4.dp))
                                .padding(horizontal = 6.dp, vertical = 2.dp)
                        ) {
                            Text(
                                text = preset.category,
                                style = MaterialTheme.typography.labelSmall,
                                color = AccentAmber
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(6.dp))
                    Text(
                        text = preset.description,
                        style = MaterialTheme.typography.bodyMedium,
                        color = TextSecondary
                    )

                    if (isSelected) {
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = "● ACTIVE ON REAL PCM STREAM",
                            style = MaterialTheme.typography.labelSmall,
                            color = AccentEmerald,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }
        }
    }
}
