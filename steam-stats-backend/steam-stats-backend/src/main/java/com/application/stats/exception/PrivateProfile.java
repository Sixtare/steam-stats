package com.application.stats.exception;

public class PrivateProfile extends RuntimeException {
    public PrivateProfile(String message) {
        super(message);
    }

    @Override
    public synchronized Throwable fillInStackTrace() {
        return this;
    }
}
