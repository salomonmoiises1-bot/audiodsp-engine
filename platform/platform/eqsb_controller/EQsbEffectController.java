package com.eqsb.platform;

import android.media.audiofx.AudioEffect;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.util.UUID;

/** Controller for a registered EQsb native effect instance on a known AudioSession. */
public final class EQsbEffectController implements AutoCloseable {
    public static final UUID TYPE_UUID = UUID.fromString("7421cb80-5a33-4f9e-a89a-0242ac120001");
    public static final UUID IMPLEMENTATION_UUID = UUID.fromString("7421cb80-5a33-4f9e-a89a-0242ac120002");

    private static final int PARAM_CMD = 0x10000 + 1;
    private final AudioEffect effect;

    public EQsbEffectController(int audioSessionId) {
        effect = new AudioEffect(TYPE_UUID, IMPLEMENTATION_UUID, 0, audioSessionId);
    }

    public void setEnabled(boolean enabled) { effect.setEnabled(enabled); }

    public void setFloat(int parameterId, float value) {
        byte[] p = intBytes(parameterId);
        byte[] v = floatBytes(value);
        setParameter(p, v);
    }

    public void setBoolean(int parameterId, boolean value) {
        byte[] p = intBytes(parameterId);
        byte[] v = intBytes(value ? 1 : 0);
        setParameter(p, v);
    }

    public void setEq32Band(int band, float gainDb) {
        setFloat(100 + band, gainDb);
    }

    private void setParameter(byte[] parameter, byte[] value) {
        // AudioEffect.setParameter(byte[], byte[]) uses the standard effect_param_t wire format.
        int status = effect.setParameter(parameter, value);
        if (status != AudioEffect.SUCCESS) throw new IllegalStateException("EQsb AudioEffect setParameter failed: " + status);
    }

    private static byte[] intBytes(int v) {
        return ByteBuffer.allocate(4).order(ByteOrder.nativeOrder()).putInt(v).array();
    }
    private static byte[] floatBytes(float v) {
        return ByteBuffer.allocate(4).order(ByteOrder.nativeOrder()).putFloat(v).array();
    }

    @Override public void close() { effect.release(); }
}
