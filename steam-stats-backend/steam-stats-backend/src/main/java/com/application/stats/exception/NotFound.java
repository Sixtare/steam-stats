package com.application.stats.exception;

public class NotFound extends RuntimeException {
    public NotFound(String message) {
        super(message);
    }
    @Override
    public synchronized Throwable fillInStackTrace() {
        return this;
    }
}
