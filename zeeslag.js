

var aoSchepen = [{ naam: "vliegdekschip", lengte: 5, kleur: "groen", afbeelding: "boot_groen.png", actief: true },
{ naam: "slagschip", lengte: 4, kleur: "rood", afbeelding: "boot_rood.png", actief: true },
{ naam: "onderzeeer", lengte: 3, kleur: "geel", afbeelding: "boot_geel.png", actief: true },
{ naam: "torpedo", lengte: 3, kleur: "oranje", afbeelding: "boot_oranje.png", actief: true },
{ naam: "patrouille", lengte: 2, kleur: "blauw", afbeelding: "boot_blauw.png", actief: true }
]

window.onload = function () {

    //DOM ELEMENTEN =============
    var eSchepen = document.getElementById('schepen');
    var eRij = document.getElementById('rij');
    var eKolom = document.getElementById('kolom');
    var eFrmPlaatsSchip = document.getElementById('frmPlaatsSchip');
    var eMsg = document.getElementById('msg');
    var aIngevuld = []; //lege array van geplaatste schepen
    var eKnopNieuw = document.getElementById('nieuwspel');
    ////LOCAL STORAGE////////=============================
    //Local Storage foutmeldingen =====
    if (localStorage.foutmelding) {
        eMsg.innerHTML = localStorage.getItem('foutmelding');
        localStorage.removeItem('foutmelding');
    }
    //Local Storage kijken of er al boten stonden====================
    if (localStorage.groen) {
        var aArraySchip = JSON.parse(localStorage.getItem("groen"));
        plaatsInHTML(aArraySchip, aIngevuld, "groen");
    }
    if (localStorage.rood) {
        var aArraySchip = JSON.parse(localStorage.getItem("rood"));
        plaatsInHTML(aArraySchip, aIngevuld, "rood");
    } if (localStorage.geel) {
        var aArraySchip = JSON.parse(localStorage.getItem("geel"));
        plaatsInHTML(aArraySchip, aIngevuld, "geel");
    } if (localStorage.oranje) {
        var aArraySchip = JSON.parse(localStorage.getItem("oranje"));
        plaatsInHTML(aArraySchip, aIngevuld, "oranje");
    } if (localStorage.blauw) {
        var aArraySchip = JSON.parse(localStorage.getItem("blauw"));
        plaatsInHTML(aArraySchip, aIngevuld, "blauw");
    }


    //INVULVELDEN=====================================================
    //Opvullen invulveld schepen=============
    var eDFSchepen = document.createDocumentFragment();
    var eOption1 = document.createElement('option');
    eOption1.value = "";
    var sOption1 = document.createTextNode("---kies een schip---");
    eOption1.appendChild(sOption1);
    eDFSchepen.appendChild(eOption1);
    //console.log(aoSchepen[1]);
    for (var i = 0; i < aoSchepen.length; i++) {
        var oSchip = aoSchepen[i];
        if (oSchip.actief) {
            var eOption = document.createElement('option');
            eOption.value = i;
            var sOption = document.createTextNode(oSchip.lengte + "*" + " " + oSchip.naam);
            eOption.appendChild(sOption);
            eDFSchepen.appendChild(eOption);
        }

    }

    eSchepen.appendChild(eDFSchepen);

    //Opvullen invulveld rij===================
    var eDFRij = document.createDocumentFragment();
    for (var i = 1; i < 11; i++) {
        var eOption = document.createElement('option');
        eOption.value = (i * 100) + ((i - 1) * 10);
        //console.log(eOption.value);
        eOption.innerHTML = i;
        eDFRij.appendChild(eOption);
    }

    eRij.appendChild(eDFRij);
    //Opvullen invulveld kolom===================
    var eDFKolom = document.createDocumentFragment();
    var aAlfabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    for (var i = 0; i < aAlfabet.length; i++) {
        var eOption = document.createElement('option');
        eOption.value = i;
        eOption.innerHTML = aAlfabet[i];
        eDFKolom.appendChild(eOption);
    }
    eKolom.appendChild(eDFKolom);

    //KNOPPEN=================================================
    //knop "plaats"============================
    eFrmPlaatsSchip.addEventListener('submit', function (e) {
        e.preventDefault();
        //console.log('knopPlaats wordt opgeroepen');
        var bValid = this.elements[0].value == "" ? false : true; 
        //controleert of er een schip is gekozen, niet lege keuze
        if (bValid === false) {
            eMsg.innerHTML = "[Foutje: kies aub een schip.]";
        } else {
            plaatsSchip(this, aIngevuld);
            window.history.go(0);
        }
    })
    //knop "nieuw" ==============================
    eKnopNieuw.addEventListener('click', function () {
        localStorage.removeItem("groen");
        localStorage.removeItem("rood");
        localStorage.removeItem("geel");
        localStorage.removeItem("oranje");
        localStorage.removeItem("blauw");
        localStorage.removeItem("foutmelding");
        window.history.go(0);

    })


}

function plaatsSchip(frm, aIngevuld) {

    //INVOER WORDT GEANALYSEERD===================
    var nSchipValue = frm.elements[0].value;
    var nLengte = aoSchepen[nSchipValue]['lengte'];
    var sKleur = aoSchepen[nSchipValue]['kleur'];


    var nRij = frm.elements[1].value;
    var nKolom = frm.elements[2].value;
    //console.log("De %s van de aoSchepen, heeft een lengte van %s en een kleur van %s. De rijwaarde is %s, de kolomwaarde is %s (A=1, b=2 enzoverder", nSchipValue, nLengte, sKleur, nRij, nKolom);
    //de waarde van de radio buttons
    var eRadios = document.getElementsByName('richting');
    var sRichting = '';
    for (var i = 0; i < eRadios.length; i++) {
        if (eRadios[i].checked) {
            sRichting = eRadios[i].value
            break
        }
    }

    //array maken van de inputwaarden==========
    var aInvul = maakInvulArray(nLengte, nRij, nKolom, sRichting);

    //console.log(aInvul);
    //RASTER CHECK=================
    var bRaster = rasterCheck(aInvul, aIngevuld);
    //console.log(bRaster);

    if (bRaster === true) {
        //Plaatsen van het schip op pagina=====
        plaatsInHTML(aInvul, aIngevuld, sKleur);

    }



}
function maakInvulArray(lengte, rij, kolom, richting) {
    var startCoordinaat = parseInt(rij) + parseInt(kolom);
    var aInvul = [startCoordinaat];
    //console.log(aInvul);
    if (richting === "horizontaal") {
        for (var i = 1; i < lengte; i++) {
            aInvul[i] = startCoordinaat + 1;
            startCoordinaat += 1;
        }
    } else {
        for (var i = 1; i < lengte; i++) {
            aInvul[i] = startCoordinaat + 110;
            startCoordinaat += 110;
        }
    }
    return aInvul
}
function rasterCheck(array, aIngevuld) { //true or false
    var eindCoordinaat = array[array.length - 1];
    var aFoutHorizontaal = [];
    var aFoutVerticaal = [1200];
    var eMsg = document.getElementById('msg');
    var bValid = true;

    for (var j = 1; j < 11; j++) {
        for (var i = 0; i < 4; i++) {
            aFoutHorizontaal[aFoutHorizontaal.length] = (j * 100 + j * 10) + i;
        }
    }
    //console.log("einde van de volledige loop einde:"+ arrayHorizontaal);
    //Zit de eindcoordinaat nog op het rooster?/horizontaal/verticaal/ andere schepen>
    if (aFoutHorizontaal.includes(eindCoordinaat)) {
        eMsg.innerHTML = "[Foutje: Er is niet genoeg plaats horizontaal]";
        localStorage.setItem('foutmelding', eMsg.innerHTML);
        bValid = false;
    } else if (eindCoordinaat >= aFoutVerticaal[0]) { //
        eMsg.innerHTML = "[Foutje: Er is niet genoeg plaats verticaal]";
        localStorage.setItem('foutmelding', eMsg.innerHTML);
        bValid = false;
    } else {
        for (var i = 0; i < array.length; i++) {
            if (aIngevuld.includes(array[i])) {
                bValid = false;
                eMsg.innerHTML = "[Foutje: Er staat al een schip op die locatie]";
                localStorage.setItem('foutmelding', eMsg.innerHTML);
            }
        }
    }
    return bValid;
}
function plaatsInHTML(aInvul, aIngevuld, sKleur) {
    //console.log(aInvul)
    nSchipValue = 1;
    //html aanpassen
    for (var i = 0; i < aInvul.length; i++) {
        var stringCode = aInvul[i].toString();
        var sDivId = stringCode.substr(stringCode.length - 2, stringCode.length - 1);
        var eDiv = document.getElementById(sDivId);
        var eImg = document.createElement('img');
        eDiv.appendChild(eImg);
        if (sKleur == "groen") {
            eImg.src = "img/boot_groen.png";
            nSchipValue = 0;
        } else if (sKleur == "rood") {
            eImg.src = "img/boot_rood.png";
            nSchipValue = 1;
        } else if (sKleur == "geel") {
            eImg.src = "img/boot_geel.png";
            nSchipValue = 2;
        } else if (sKleur == "oranje") {
            eImg.src = "img/boot_oranje.png";
            nSchipValue = 3;
        } else if (sKleur == "blauw") {
            nSchipValue = 4;
            eImg.src = "img/boot_blauw.png";
        }
    }
    //De array met de ingevulde vakken aanvullen
    for (var i = 0; i < aInvul.length; i++) {
        aIngevuld[aIngevuld.length] = aInvul[i];
    }
    //de keuzelijst aanpassen van schip=====
    aoSchepen[nSchipValue]['actief'] = false;
    //console.log(aoSchepen[nSchipValue]['actief']);
    localStorage.setItem(sKleur, JSON.stringify(aInvul));

}



