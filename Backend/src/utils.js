"use strict";

/**
 * Hilfsfunktion zur Vereinfachung der HTTP-Handler-Methoden
 */
export function wrapHandler(that, func) {
    func = func.bind(that);

    return (req, res, next) => {
        try {
            return func(req, res, next)?.catch((ex) => {
                return next(ex);
            });
        } catch (ex) {
            return next(ex);
        }
    };
};
