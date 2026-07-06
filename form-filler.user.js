// ==UserScript==
// @name         Super Form Filler Multi-Form (Data-Row Patch)
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Risolve il disallineamento sui form che usano sia attributi data-row sia ID numerici.
// @author       Dev Peer
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
    "use strict";

    const nomiM = [
        "Mario",
        "Luigi",
        "Giovanni",
        "Francesco",
        "Alessandro",
        "Roberto",
        "Stefano",
        "Marco",
        "Giuseppe",
        "Antonio",
        "Davide",
        "Luca",
        "Vincenzo",
        "Emanuele",
        "Andrea",
    ];
    const nomiF = [
        "Anna",
        "Giulia",
        "Francesca",
        "Elena",
        "Chiara",
        "Laura",
        "Sara",
        "Martina",
        "Silvia",
        "Federica",
        "Giorgia",
        "Alice",
        "Sofia",
        "Valentina",
        "Roberta",
    ];
    const cognomi = [
        "Rossi",
        "Bianchi",
        "Verdi",
        "Ferrari",
        "Russo",
        "Esposito",
        "Romano",
        "Gallo",
        "Costa",
        "Fontana",
        "Lombardi",
        "Moretti",
        "Ricci",
        "Marini",
        "Bruno",
        "Barbieri",
    ];

    const comuni = [
        { nome: "Roma", codice: "H501" },
        { nome: "Milano", codice: "F205" },
        { nome: "Torino", codice: "L219" },
        { nome: "Palermo", codice: "G273" },
        { nome: "Napoli", codice: "F839" },
        { nome: "Firenze", codice: "D612" },
        { nome: "Bologna", codice: "A944" },
        { geno: "Genova", codice: "D969" },
        { nome: "Venezia", codice: "L736" },
        { nome: "Bari", codice: "A662" },
    ];

    const mesiInfo = [
        { lett: "A", num: "01" },
        { lett: "B", num: "02" },
        { lett: "C", num: "03" },
        { lett: "D", num: "04" },
        { lett: "E", num: "05" },
        { lett: "H", num: "06" },
        { lett: "L", num: "07" },
        { lett: "M", num: "08" },
        { lett: "P", num: "09" },
        { lett: "R", num: "10" },
        { lett: "S", num: "11" },
        { lett: "T", num: "12" },
    ];

    const dispari = {
        0: 1,
        1: 0,
        2: 5,
        3: 7,
        4: 9,
        5: 13,
        6: 15,
        7: 17,
        8: 19,
        9: 21,
        A: 1,
        B: 0,
        C: 5,
        D: 7,
        E: 9,
        F: 13,
        G: 15,
        H: 17,
        I: 19,
        J: 21,
        K: 2,
        L: 4,
        M: 18,
        N: 20,
        O: 11,
        P: 3,
        Q: 6,
        R: 8,
        S: 12,
        T: 14,
        U: 16,
        V: 10,
        W: 22,
        X: 25,
        Y: 24,
        Z: 23,
    };
    const pari = {
        0: 0,
        1: 1,
        2: 2,
        3: 3,
        4: 4,
        5: 5,
        6: 6,
        7: 7,
        8: 8,
        9: 9,
        A: 0,
        B: 1,
        C: 2,
        D: 3,
        E: 4,
        F: 5,
        G: 6,
        H: 7,
        I: 8,
        J: 9,
        K: 10,
        L: 11,
        M: 12,
        N: 13,
        O: 14,
        P: 15,
        Q: 16,
        R: 17,
        S: 18,
        T: 19,
        U: 20,
        V: 21,
        W: 22,
        X: 23,
        Y: 24,
        Z: 25,
    };
    const cinMap = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    function calcolaCodiceCognome(cognome) {
        let c = cognome.toUpperCase().replace(/[^A-Z]/g, "");
        let consonanti = c.replace(/[AEIOU]/g, "");
        let vocali = c.replace(/[^AEIOU]/g, "");
        return (consonanti + vocali + "XXX").substring(0, 3);
    }

    function calcolaCodiceNome(nome) {
        let n = nome.toUpperCase().replace(/[^A-Z]/g, "");
        let consonanti = n.replace(/[AEIOU]/g, "");
        let vocali = n.replace(/[^AEIOU]/g, "");
        if (consonanti.length >= 4)
            return consonanti[0] + consonanti[2] + consonanti[3];
        return (consonanti + vocali + "XXX").substring(0, 3);
    }

    function calcolaCIN(cf15) {
        let somma = 0;
        for (let i = 0; i < 15; i++) {
            const char = cf15[i].toUpperCase();
            if ((i + 1) % 2 !== 0) somma += dispari[char] || 0;
            else somma += pari[char] || 0;
        }
        return cinMap[somma % 26];
    }

    function generaProfiloCasuale() {
        const sesso = Math.random() > 0.5 ? "M" : "F";
        const nome =
            sesso === "M"
                ? nomiM[Math.floor(Math.random() * nomiM.length)]
                : nomiF[Math.floor(Math.random() * nomiF.length)];
        const cognome = cognomi[Math.floor(Math.random() * cognomi.length)];
        const comune = comuni[Math.floor(Math.random() * comuni.length)];
        const meseObj = mesiInfo[Math.floor(Math.random() * mesiInfo.length)];

        const giornoVal = Math.floor(Math.random() * 28 + 1);
        const annoNum = Math.floor(Math.random() * 30 + 70);

        let cfBase = "";
        cfBase += calcolaCodiceCognome(cognome);
        cfBase += calcolaCodiceNome(nome);
        cfBase += annoNum.toString();
        cfBase += meseObj.lett;

        let g = giornoVal;
        if (sesso === "F") g += 40;
        cfBase += g.toString().padStart(2, "0");
        cfBase += comune.codice;
        cfBase += calcolaCIN(cfBase);

        const randId = Math.floor(Math.random() * 900 + 100);

        return {
            nome,
            cognome,
            sesso,
            cf: cfBase,
            email: `${nome.toLowerCase()}.${cognome.toLowerCase()}${randId}@example.com`,
            dataStandard: `${giornoVal.toString().padStart(2, "0")}/${meseObj.num}/19${annoNum}`,
            dataInputDate: `19${annoNum}-${meseObj.num}-${giornoVal.toString().padStart(2, "0")}`,
            comuneNome: comune.nome,
        };
    }

    function isVisible(el) {
        if (!el) return false;
        const style = window.getComputedStyle(el);
        return (
            !!(
                el.offsetWidth ||
                el.offsetHeight ||
                el.getClientRects().length
            ) &&
            style.display !== "none" &&
            style.visibility !== "hidden" &&
            style.opacity !== "0"
        );
    }

    function impostaValore(el, valore) {
        if (!el || el.value) return;
        if (el.tagName === "SELECT") {
            const options = Array.from(el.options);
            const targetOpt = options.find(
                (opt) =>
                    opt.value.toLowerCase() === valore.toLowerCase() ||
                    opt.text.toLowerCase().includes(valore.toLowerCase()),
            );
            if (targetOpt) el.value = targetOpt.value;
        } else {
            el.value = valore;
        }
        el.dispatchEvent(new Event("input", { bubbles: true }));
        el.dispatchEvent(new Event("change", { bubbles: true }));
    }

    document.addEventListener("dblclick", function (e) {
        const target = e.target;

        if (
            (target.tagName === "INPUT" || target.tagName === "SELECT") &&
            isVisible(target)
        ) {
            const ambito = target.closest("form") || document;
            const elementi = ambito.querySelectorAll("input, select");
            const profiliAssegnati = {};

            elementi.forEach((el) => {
                if (!isVisible(el)) return;

                const nameStr = (el.name || "").toLowerCase();
                const idStr = (el.id || "").toLowerCase();
                const desc =
                    `${nameStr} ${idStr} ${el.placeholder || ""}`.toLowerCase();
                const type = (el.type || "").toLowerCase();

                let groupKey = null;

                // 1. Controlla prima di tutto attributi espliciti di riga (es. data-row="1")
                const dataRow =
                    el.getAttribute("data-row") ||
                    el.getAttribute("data-index") ||
                    el.getAttribute("data-id");
                if (dataRow) {
                    groupKey = "idx_" + dataRow;
                }

                // 2. Se manca, estrai il numero da ID o Name (es. nome_1 -> 1)
                if (!groupKey) {
                    const matchIndice =
                        `${nameStr} ${idStr}`.match(/\[(\d+)\]/) ||
                        `${nameStr} ${idStr}`.match(/_(\d+)/) ||
                        `${nameStr} ${idStr}`.match(/-(\d+)/);
                    if (matchIndice) {
                        groupKey = "idx_" + matchIndice[1];
                    }
                }

                // 3. Fallback sul contenitore strutturale (incluso .formpart del tuo HTML)
                if (!groupKey) {
                    const parentContainer = el.closest(
                        'tr, fieldset, .row, .form-row, .formpart, [class*="block"], [class*="section"]',
                    );
                    if (parentContainer) {
                        if (!parentContainer.dataset.fillerGroupId) {
                            parentContainer.dataset.fillerGroupId =
                                "gen_" + Math.floor(Math.random() * 100000);
                        }
                        groupKey = parentContainer.dataset.fillerGroupId;
                    }
                }

                if (!groupKey) groupKey = "default";

                // Assegna o recupera il profilo per questo blocco
                if (!profiliAssegnati[groupKey]) {
                    profiliAssegnati[groupKey] = generaProfiloCasuale();
                }

                const p = profiliAssegnati[groupKey];

                // --- COMPILAZIONE CAMPI ---
                if (
                    desc.includes("cf") ||
                    desc.includes("fiscale") ||
                    desc.includes("fiscal") ||
                    el.maxLength === 16
                ) {
                    impostaValore(el, p.cf);
                } else if (
                    (desc.includes("nome") ||
                        desc.includes("name") ||
                        desc.includes("first")) &&
                    !desc.includes("cognome") &&
                    !desc.includes("surname") &&
                    !desc.includes("last") &&
                    !desc.includes("user") &&
                    !desc.includes("full")
                ) {
                    impostaValore(el, p.nome);
                } else if (
                    desc.includes("cognome") ||
                    desc.includes("surname") ||
                    desc.includes("last")
                ) {
                    impostaValore(el, p.cognome);
                }
                // Riconosce la mail anche se scritta come E-Mail nel form
                else if (
                    type === "email" ||
                    desc.includes("email") ||
                    desc.includes("mail")
                ) {
                    impostaValore(el, p.email);
                } else if (
                    desc.includes("nascita") ||
                    desc.includes("birth") ||
                    type === "date"
                ) {
                    impostaValore(
                        el,
                        type === "date" ? p.dataInputDate : p.dataStandard,
                    );
                } else if (
                    desc.includes("sesso") ||
                    desc.includes("genere") ||
                    desc.includes("gender")
                ) {
                    impostaValore(el, p.sesso);
                } else if (
                    desc.includes("comune") ||
                    desc.includes("citta") ||
                    desc.includes("city") ||
                    desc.includes("birthplace")
                ) {
                    impostaValore(el, p.comuneNome);
                }
            });
        }
    });
})();
