package com.eqsb

import android.app.Application
import android.util.Log

class EQsbApp : Application() {
    override fun onCreate() {
        super.onCreate()
        Log.i("EQsbApp", "EQsb Application initialized. Package: com.eqsb")
    }
}
