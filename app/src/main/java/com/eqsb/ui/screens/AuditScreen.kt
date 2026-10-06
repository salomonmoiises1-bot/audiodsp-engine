package com.eqsb.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.eqsb.backend.AudioRoutingAudit
import com.eqsb.ui.theme.*
import com.eqsb.viewmodel.EQsbViewModel

@Composable
fun AuditScreen(viewModel: EQsbViewModel) {
    val sections = viewModel.getAuditSections()

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(BgDark)
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            Text(
                text = "AUDIO EFFECT & AUDIOFLINGER AUDIT",
                style = MaterialTheme.typography.titleMedium,
                color = AccentCyan
            )
            Text(
                text = "Architectural analysis of Android OS audio routing, Session 0 restrictions, and system vs APK boundaries.",
                style = MaterialTheme.typography.labelSmall,
                color = TextSecondary
            )
        }

        items(sections) { sec ->
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .border(
                        width = 1.dp,
                        color = if (sec.apkAllowed) AccentCyan.copy(alpha = 0.4f) else AccentAmber.copy(alpha = 0.4f),
                        shape = RoundedCornerShape(12.dp)
                    ),
                colors = CardDefaults.cardColors(containerColor = SurfaceDark),
                shape = RoundedCornerShape(12.dp)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text(
                            text = sec.title,
                            style = MaterialTheme.typography.titleMedium,
                            color = TextPrimary,
                            fontWeight = FontWeight.Bold,
                            modifier = Modifier.weight(1f)
                        )
                        Box(
                            modifier = Modifier
                                .background(
                                    if (sec.apkAllowed) AccentEmerald.copy(alpha = 0.2f) else AccentRose.copy(alpha = 0.2f),
                                    RoundedCornerShape(4.dp)
                                )
                                .padding(horizontal = 8.dp, vertical = 2.dp)
                        ) {
                            Text(
                                text = if (sec.apkAllowed) "STANDARD APK ALLOWED" else "REQUIRES SYSTEM/VENDOR",
                                style = MaterialTheme.typography.labelSmall,
                                color = if (sec.apkAllowed) AccentEmerald else AccentRose,
                                fontWeight = FontWeight.Bold,
                                fontSize = 9.sp
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(6.dp))
                    Text(
                        text = sec.summary,
                        style = MaterialTheme.typography.bodyMedium,
                        color = AccentAmber
                    )

                    Spacer(modifier = Modifier.height(10.dp))
                    Text(
                        text = sec.technicalDetails,
                        style = MaterialTheme.typography.bodyMedium,
                        color = TextSecondary,
                        lineHeight = 18.sp
                    )
                }
            }
        }
    }
}
