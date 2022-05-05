"use strict";

import Page from "../page.js";
import HtmlTemplate from "./page-edit.html";

/**
 * Klasse PageEdit: Stellt die Seite zum Anlegen oder Bearbeiten einer Adresse
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

    /**
     * HTML-Inhalt und anzuzeigende Daten laden.
     *
     * HINWEIS: Durch die geerbte init()-Methode wird `this._mainElement` mit
     * dem <main>-Element aus der nachgeladenen HTML-Datei versorgt. Dieses
     * Element wird dann auch von der App-Klasse verwendet, um die Seite
     * anzuzeigen. Hier muss daher einfach mit dem üblichen DOM-Methoden
     * `this._mainElement` nachbearbeitet werden, um die angezeigten Inhalte
     * zu beeinflussen.
     *
     * HINWEIS: In dieser Version der App wird mit dem üblichen DOM-Methoden
     * gearbeitet, um den finalen HTML-Code der Seite zu generieren. In größeren
     * Apps würde man ggf. eine Template Engine wie z.B. Nunjucks integrieren
     * und den JavaScript-Code dadurch deutlich vereinfachen.
     */
    async init() {
        // HTML-Inhalt nachladen
        await super.init();

        // Bearbeiteten Datensatz laden
        if (this._editId) {
            this._url = `/address/${this._editId}`;
            this._dataset = await this._app.backend.fetch("GET", this._url);
            this._title = `${this._dataset.name} ${this._dataset.rasse}`;
        } else {
            this._url = `/kleintiere`;
            this._title = "Adresse hinzufügen";
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
