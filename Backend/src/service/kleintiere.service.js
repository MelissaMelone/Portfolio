"use strict"

import DatabaseFactory from "../database.js";
import {ObjectId} from "mongodb";

/**
 * Geschäftslogik zur Verwaltung von Adressen. Diese Klasse implementiert die
 * eigentliche Anwendungslogik losgelöst vom technischen Übertragungsweg.
 * Die Adressen werden der Einfachheit halber in einer MongoDB abgelegt.
 */
export default class KleintiereService {
    /**
     * Konstruktor.
     */
    constructor() {
        this._kleintiere = DatabaseFactory.database.collection("kleintiere");
    }

    /**
     * Adressen suchen. Unterstützt wird lediglich eine ganz einfache Suche,
     * bei der einzelne Felder auf exakte Übereinstimmung geprüft werden.
     * Zwar unterstützt MongoDB prinzipiell beliebig komplexe Suchanfragen.
     * Um das Beispiel klein zu halten, wird dies hier aber nicht unterstützt.
     *
     * @param {Object} query Optionale Suchparameter
     * @return {Promise} Liste der gefundenen Adressen
     */
    async search(query) {
        let cursor = this._kleintiere.find(query, {
            sort: {
                name: 1,
                alter: 1,
                geschlecht: 1,
                zustand: 1,
                rasse: 1,
            }
        });

        return cursor.toArray();
    }

    /**
     * Speichern einer neuen Adresse.
     *
     * @param {Object} address Zu speichernde Adressdaten
     * @return {Promise} Gespeicherte Adressdaten
     */
    async create(kleintiere) {
        kleintiere = kleintiere || {};

        let newKleintier = {
            name:       kleintiere.name|| "",
            alter:      kleintiere.alter  || "",
            geschlecht: kleintiere.geschlecht     || "",
            zustand:    kleintiere.zustand      || "",
            rasse:      kleintiere.rasse   || "",
        };

        let result = await this._kleintiere.insertOne(newKleintier);
        return await this._kleintiere.findOne({_id: result.insertedId});
    }

    /**
     * Auslesen einer vorhandenen Adresse anhand ihrer ID.
     *
     * @param {String} id ID der gesuchten Adresse
     * @return {Promise} Gefundene Adressdaten
     */
    async read(id) {
        let result = await this._addresses.findOne({_id: new ObjectId(id)});
        return result;
    }

    /**
     * Aktualisierung einer Adresse, durch Überschreiben einzelner Felder
     * oder des gesamten Adressobjekts (ohne die ID).
     *
     * @param {String} id ID der gesuchten Adresse
     * @param {[type]} address Zu speichernde Adressdaten
     * @return {Promise} Gespeicherte Adressdaten oder undefined
     */
    async update(id, kleintiere) {
        let oldKleintier = await this._kleintiere.findOne({_id: new ObjectId(id)});
        if (!oldKleintier) return;

        let updateDoc = {
            $set: {},
        }

        if (kleintiere.name)             updateDoc.$set.name        = kleintiere.name;
        if (kleintiere.alter)            updateDoc.$set.alter       = kleintiere.alter;
        if (kleintiere.geschlecht)       updateDoc.$set.geschlecht  = kleintiere.geschlecht;
        if (kleintiere.zustand)          updateDoc.$set.zustand     = kleintiere.zustand;
        if (kleintiere.rasse)            updateDoc.$set.rasse       = kleintiere.rasse;

        await this._kleintiere.updateOne({_id: new ObjectId(id)}, updateDoc);
        return this._kleintiere.findOne({_id: new ObjectId(id)});
    }

    /**
     * Löschen einer Adresse anhand ihrer ID.
     *
     * @param {String} id ID der gesuchten Adresse
     * @return {Promise} Anzahl der gelöschten Datensätze
     */
    async delete(id) {
        let result = await this._kleintiere.deleteOne({_id: new ObjectId(id)});
        return result.deletedCount;
    }
}
