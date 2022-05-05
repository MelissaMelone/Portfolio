"use strict"

import DatabaseFactory from "../database.js";
import {ObjectId} from "mongodb";

/**
 * Geschäftslogik zur Verwaltung von Pflegekraeften. Diese Klasse implementiert die
 * eigentliche Anwendungslogik losgelöst vom technischen Übertragungsweg.
 * Die Pflegekraefte werden in einer MongoDB abgelegt.
 */
export default class PflegekraftService {
    /**
     * Konstruktor.
     */
    constructor() {
        this._pflegekraft = DatabaseFactory.database.collection("pflegekraft");
    }

    /**
     * Pflegekraft suchen. Unterstützt wird lediglich eine ganz einfache Suche,
     * bei der einzelne Felder auf exakte Übereinstimmung geprüft werden.
     * Zwar unterstützt MongoDB prinzipiell beliebig komplexe Suchanfragen.
     * Um das Beispiel klein zu halten, wird dies hier aber nicht unterstützt.
     *
     * @param {Object} query Optionale Suchparameter
     * @return {Promise} Liste der gefundenen Pflegekraefte
     */
    async search(query) {
        let cursor = this._pflegekraft.find(query, {
            sort: {
                vorname: 1,
                nachname: 1,
                rolle: 1,
                eMail: 1,
            }
        });

        return cursor.toArray();
    }

    /**
     * Speichern einer neuen Pflegekraft.
     *
     * @param {Object} pflegekraft Zu speichernde Pflegekraft
     * @return {Promise} Gespeicherte Pflegekraft
     */
    async create(pflegekraft) {
        pflegekraft = pflegekraft || {};

        let newPflegekraft = {
            vorname:       pflegekraft.vorname  || "",
            nachname:      pflegekraft.nachname || "",
            rolle:         pflegekraft.rolle    || "",
            eMail:         pflegekraft.eMail    || "",
        };

        let result = await this._pflegekraft.insertOne(newPflegekraft);
        return await this._pflegekraft.findOne({_id: result.insertedId});
    }

    /**
     * Auslesen eines vorhandenen Pflegekraftdatensatzes anhand seiner ID.
     *
     * @param {String} id ID der gesuchten Pflegekraft
     * @return {Promise} Gefundene Pflegekraft
     */
    async read(id) {
        let result = await this._pflegekraft.findOne({_id: new ObjectId(id)});
        return result;
    }

    /**
     * Aktualisierung eines Pflegekraftdatensatzes, durch Überschreiben einzelner Felder
     * oder des gesamten Pflegekraftobjekts (ohne die ID).
     *
     * @param {String} id ID der gesuchten Pflegekraft
     * @param {[type]} pflegekraft Zu speichernde Pflegekraft
     * @return {Promise} Gespeicherte Pflegekraft oder undefined
     */
    async update(id, pflegekraft) {
        let oldPflegekraft = await this._pflegekraft.findOne({_id: new ObjectId(id)});
        if (!oldPflegekraft) return;

        let updateDoc = {
            $set: {},
        }

        if (pflegekraft.vorname)             updateDoc.$set.vorname      = pflegekraft.vorname;
        if (pflegekraft.nachname)            updateDoc.$set.nachname     = pflegekraft.nachname;
        if (pflegekraft.rolle)               updateDoc.$set.rolle        = pflegekraft.rolle;
        if (pflegekraft.eMail)               updateDoc.$set.eMail        = pflegekraft.eMail;

        await this._pflegekraft.updateOne({_id: new ObjectId(id)}, updateDoc);
        return this._pflegekraft.findOne({_id: new ObjectId(id)});
    }

    /**
     * Löschen eines Pflegekraftdatensatzes anhand seiner ID.
     *
     * @param {String} id ID der gesuchten Pflegekraft
     * @return {Promise} Anzahl der gelöschten Datensätze
     */
    async delete(id) {
        let result = await this._pflegekraft.deleteOne({_id: new ObjectId(id)});
        return result.deletedCount;
    }
}
