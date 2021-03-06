"use strict"

import {wrapHandler} from "../utils.js";
import path from "path";
import { readFile } from "fs/promises";

// Verzeichnisnamen der Quellcodedatei ermitteln
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Controller für die Wurzeladresse des Webservices.
 */
export default class RootController {

    constructor(server, prefix) {
        this._openApiFile = path.normalize(path.join(__dirname, "..", "api", "openapi.yaml"));

        server.get(prefix, wrapHandler(this, this.index));
        server.get(prefix + "/openapi.yaml", wrapHandler(this, this.openApi));
    }

    /**
     * GET /:
     * Übersicht über die vorhandenen Collections liefern
     */
    async index(req, res, next) {
        res.sendResult([
            {
                _name: "kleintiere",
                query: {url: "/kleintiere", method: "GET", queryParams: ["search", "name", "alter", "geschlecht", "zustand", "rasse"]},
                create: {url: "/kleintiere", method: "POST"},
            },
            {
                _name: "pflegekraft",
                query: {url: "/pflegekraft", method: "GET", queryParams: ["search", "vorname", "nachname", "rolle", "eMail"]},
                create: {rul: "/pflegekraft", method: "POST"},
            }
        ]);

        next();
    }

    /**
     * GET /openapi.yaml:
     * Abruf der OpenAPI-Spezifikation
     */
    async openApi(req, res, next) {
        if (req.query.openapi !== undefined) {
            let filecontent = await readFile(this._openApiFile);

            res.status(200);
            res.header("content-type", "application/openapi+yaml");
            res.sendRaw(filecontent);
        } else {
            res.send();
        }

        next();
    }
}
