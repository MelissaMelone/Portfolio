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
            name: "",
            alter: "",
            geschlecht: "",
            zustand: "",
            rasse: "",
        };

        // Eingabefelder
        this._nameInput = null;
        this._alterInput  = null;
        this._geschlechtInput     = null;
        this._zustandInput     = null;
        this._rasseInput     = null;
    }


    async init() {
        // HTML-Inhalt nachladen
        await super.init();

        // Bearbeiteten Datensatz laden
        if (this._editId) {
            this._url = `/kleintiere/${this._editId}`;
            this._dataset = await this._app.backend.fetch("GET", this._url);
            this._title = `${this._dataset.name} ${this._dataset.rasse}`;
        } else {
            this._url = `/kleintiere`;
            this._title = "Kleintier hinzufügen";
        }

        // Platzhalter im HTML-Code ersetzen
        let html = this._mainElement.innerHTML;
        html = html.replace("$NAME$", this._dataset.name);
        html = html.replace("$ALTER$", this._dataset.alter);
        html = html.replace("$GESCHLECHT$", this._dataset.geschlecht);
        html = html.replace("$RASSE$", this._dataset.rasse);
        html = html.replace("$ZUSTAND$", this._dataset.zustand);
        this._mainElement.innerHTML = html;

        // Event Listener registrieren
        let saveButton = this._mainElement.querySelector(".action.save");
        saveButton.addEventListener("click", () => this._saveAndExit());

        // Eingabefelder zur späteren Verwendung merken
        this._nameInput = this._mainElement.querySelector("input.name");
        this._alterInput  = this._mainElement.querySelector("input.alter");
        this._geschlechtInput  = this._mainElement.querySelector("input.geschlecht");
        this._rasseInput     = this._mainElement.querySelector("input.rasse");
        this._zustandInput     = this._mainElement.querySelector("input.zustand");
    }

    /**
     * Speichert den aktuell bearbeiteten Datensatz und kehrt dann wieder
     * in die Listenübersicht zurück.
     */
    async _saveAndExit() {
        // Eingegebene Werte prüfen
        this._dataset._id        = this._editId;
        this._dataset.name = this._nameInput.value.trim();
        this._dataset.alter  = this._alterInput.value.trim();
        this._dataset.geschlecht  = this._geschlechtInput.value.trim();
        this._dataset.rasse      = this._rasseInput.value.trim();
        this._dataset.zustand     = this._zustandInput.value.trim();

        if (!this._dataset.name) {
            alert("Geben Sie dem Kleintier einen Namen.");
            return;
        }

        if (!this._dataset.rasse) {
            alert("Geben Sie die Rasse des Tieres an.");
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
        location.hash = "#/";
    }
};
