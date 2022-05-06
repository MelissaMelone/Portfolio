"use strict";

import Page from "../page.js";
import HtmlTemplate from "./page-edit.html";

/**
 * Klasse PageEdit: Stellt die Seite zum Anlegen oder Bearbeiten eines Kleintieres
  * zur Verfügung.
 */
export default class PageEdit extends Page {
    /**
     * Konstruktor.
     *
     * @param {App} app Instanz der App-Klasse
     * @param {Integer} editId ID des bearbeiteten Datensatzes
     */
    constructor(app, editId) {
        super(app, HtmlTemplate);

        // Bearbeiteter Datensatz
        this._editId = editId;

        this._dataset = {
            vorname: "",
            nachname: "",
            rolle: "",
            eMail: "",

        };

        // Eingabefelder
        this._vornameInput = null;
        this._nachnameInput  = null;
        this._rolleInput     = null;
        this._eMailInput     = null;

    }


    async init() {
        // HTML-Inhalt nachladen
        await super.init();

        // Bearbeiteten Datensatz laden
        if (this._editId) {
            this._url = `/pflegekraft/${this._editId}`;
            this._dataset = await this._app.backend.fetch("GET", this._url);
            this._title = `${this._dataset.vorname} ${this._dataset.nachname}`;
        } else {
            this._url = `/pflegekraft`;
            this._title = "Pflegekraft hinzufügen";
        }

        // Platzhalter im HTML-Code ersetzen
        let html = this._mainElement.innerHTML;
        html = html.replace("$VORNAME$", this._dataset.vorname);
        html = html.replace("$NACHNAME$", this._dataset.nachname);
        html = html.replace("$ROLLE$", this._dataset.rolle);
        html = html.replace("$EMAIL$", this._dataset.eMail);
        this._mainElement.innerHTML = html;

        // Event Listener registrieren
        let saveButton = this._mainElement.querySelector(".action.save");
        saveButton.addEventListener("click", () => this._saveAndExit());

        // Eingabefelder zur späteren Verwendung merken
        this._vornameInput = this._mainElement.querySelector("input.vorname");
        this._nachnameInput  = this._mainElement.querySelector("input.nachname");
        this._rolleInput  = this._mainElement.querySelector("input.rolle");
        this._eMailInput     = this._mainElement.querySelector("input.eMail");

    }

    /**
     * Speichert den aktuell bearbeiteten Datensatz und kehrt dann wieder
     * in die Listenübersicht zurück.
     */
    async _saveAndExit() {
        // Eingegebene Werte prüfen
        this._dataset._id        = this._editId;
        this._dataset.vorname = this._vornameInput.value.trim();
        this._dataset.nachname  = this._nachnameInput.value.trim();
        this._dataset.rolle  = this._rolleInput.value.trim();
        this._dataset.eMail      = this._eMailInput.value.trim();

        if (!this._dataset.vorname) {
            alert("Geben Sie den Vornamen der Pflegekraft ein.");
            return;
        }

        if (!this._dataset.nachname) {
            alert("Geben Sie den Nachnamen der Pflegekraft ein");
            return;
        }

        // Datensatz speichern
        try {
            if (this._editId) {
                await this._app.backend.fetch("PUT", this._url, {body: this._dataset});
            } else {
                await this._app.backend.fetch("POST", this._url, {body: this._dataset});
            }
        } catch (ex) {
            this._app.showException(ex);
            return;
        }

        // Zurück zur Übersicht
        location.hash = "#/P/";
    }
};
