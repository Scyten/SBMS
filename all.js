function all() {

    var PV1 = sessionStorage['PV1'];
    var PV2 = sessionStorage['PV2'];
    var Batp = sessionStorage['Batp'];
    var Batn = sessionStorage['Batn'];
    var Ld = sessionStorage['Ld'];
    var ELd = sessionStorage['ELd'];

    var sbms = localStorage['sbmsb'];
    var xsbms = localStorage['xsbms'];
    var gsbms = localStorage['gsbms'];
    var eA = localStorage['eA'];
    var eW = localStorage['eW'];
    var sbms2 = JSON.parse(localStorage['sbms2']);
    var sbms1 = ['', 'Batt', 'PV1', 'PV2', 'ExtLd', 'PV1+PV2', 'Load', 'ExtLd', localStorage['cap'], localStorage['WA'], localStorage['model']];
    var lg1 = "#B33A33B##333333B##B33A33B##B33333B##B''''''##A44A544##B44444B##;75444A##144B444##B33333B##444444B##2331$$A##B8:B:8B#";

    // var c = document.getElementById('Lg');
    // var ctx = c.getContext('2d');
    var r = '</br>'


    function htm(id, s) {
        document.getElementById(id).innerHTML = s;
    };


    function dcmp(p, s, d) {
        xx = 0;
        for (z = 0; z < s; z++) {
            xx = xx + ((d.charCodeAt((p + s - 1) - z) - 35) * Math.pow(91, z));
        }
        return xx;
    }

    function fN(nm) {
        return nm.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }

    htm('id', sbms1[10]);
    var SOC = '';
    SOC = dcmp(6, 2, sbms);
    // SOC = 80;
    htm('SOC', '<b>' + SOC + '%</b>');
    $('#battery').css('width', SOC + '%');
    $('#battery').css('background', getHslColor(SOC));
    // document.getElementById('bat').value = SOC;

    if (sbms2[10] != 1) {
        if (ledsStatus[0] != 0) {
            ledsStatus[0] = 0;
            mos(0);
        }
    } else {
        if (ledsStatus[0] != 1) {
            ledsStatus[0] = 1;
            mos_activate(0);
        }
    }

    if (sbms2[11] != 1) {
        if (ledsStatus[1] != 0) {
            ledsStatus[1] = 0;
            mos(1);
        }
    } else {
        if (ledsStatus[1] != 1) {
            ledsStatus[1] = 1;
            mos_activate(1);
        }
    }

    function mos(rr) {
        // document.getElementById('mo' + rr).style.background = 'rgba(120,90,0,0.7)';
        $('#led' + rr).find('.led').css('animation', 'none');
    }

    function mos_activate(rr) {
        $('#led' + rr).find('.led').css('animation', 'blinkYellow 2s infinite;');
    }

    drawChart('PV1 ', 'PV2 ', 0, PV1, PV2, '#ch0', 'rgba(255,255,0,0.75)', 'rgba(0,255,255,0.75)', 1, 2, 200);
    drawChart('Batp ', 'Batn ', 1, Batp, Batn, '#ch1', 'rgba(0,255,0,0.75)', 'rgba(255,0,0,0.75)', 1, 2, 200);
    drawChart('Load', 'ExtLd', 2, Ld, ELd, '#ch2', 'rgba(0,0,255,0.75)', 'rgba(255,0,255,0.75)', 1, 2, 200);

    function drawChart(n, m, k, d1, d2, sl, cl, cl2, p, b, bt) {
        var cht = document.querySelector(sl);
        var l = 0;
        var avg1 = 0;
        var avg2 = 0;
        for (i = 0; i < 240; i++) {
            var h1 = (((dcmp(i, 1, d1)) / 180) * bt);
            var h2 = (((dcmp(i, 1, d2)) / 180) * bt);
            var f2 = document.createElement('div');
            var f = document.createElement('div');
            // var f3 = document.createElement('div');
            f.setAttribute('class', 'bar');
            f2.setAttribute('class', 'bar');
            // f3.setAttribute('class', 'bar');
            f.style.background = cl;
            f2.style.background = cl2;
            // f3.style.background = '#322';
            f.style.width = b + 'px';
            f2.style.width = b + 'px';
            // f3.style.width = b + 'px';
            f.style.height = h1 + '%';
            f2.style.height = h2 + '%';
            // f3.style.height = (100 - (h1 + h2)) + '%';
            f.style.left = l + 'px';
            f2.style.left = l + 'px';
            // f3.style.left = l + 'px';
            f2.style.bottom = h1 + '%';
            // f3.style.bottom = h2 + h1 + '%';
            cht.appendChild(f);
            cht.appendChild(f2);
            // cht.appendChild(f3);
            l += (b + p);
            if (i >= 180) {
                avg1 += h1;
                avg2 += h2;
            }
        }
        k = k * 3;
        var sp = '        ';
        var dd = 3;
        ss = 1000;
        b0 = '12h' + sp;
        if (sbms1[9] == 'W') {
            dd = 1;
            ss = 10
        }

        avg1 = Math.round(avg1 / 60);
        avg2 = Math.round(avg2 / 60);

        if (averages[k][0] != avg1) {
            averages[k][0] = avg1;
            setFanRotation(k, 0);
        }
        else if (averages[k][1] != avg2) {
            averages[k][1] = avg2;
            setFanRotation(k, 1);
        }

        for (i = 0; i < 3; i++) {
            if (i == 1) {
                n = m = '';
                b0 = '1h';
            }
            else if (i == 2) {
                n = m = '';
                b0 = '1m';
            }
            $("#graph-info-" + k + "-" + i).html((dcmp((k + i) * 3, 3, gsbms) / ss).toFixed(dd) + sbms1[9])
            // htm('g' + (k + i), '<V5> ' + b0 + '<v' + (k) + '>' + n + '</v' + (k) + '><v' + (k + 1) + '>' + m + '</v' + (k + 1) + '>' + sp + (dcmp((k + i) * 3, 3, gsbms) / ss).toFixed(dd) + sbms1[9] + '</V5>');
        }
    }


    mt8('#mt1');

    function mt8(m1) {
        var w = new Array();
        for (i = 0; i < 20; i++) {
            w[i] = '';
        }

        var bv = pv3 = sv = max1 = min1 = 0;
        for (x1 = 0; x1 < 8; x1++) {
            var cv = dcmp((x1 * 2) + 8, 2, sbms) / 1000;
            var selector = "span:eq("+x1+")";
            if (sbms2[9] == x1 + 1) {
                $("#d2, #d3").find(selector).removeClass().addClass('mn1');
            }

            if (sbms2[8] == x1 + 1) {
                $("#d2, #d3").find(selector).removeClass().addClass('mx1');
            }

            $("#d3").find(selector).html(cv.toFixed(3));
            $("#d4").find(selector).html(sbms2[x1] != 1? "V": "<");

            bv += cv;
            if (cv > 0) {
                var min = dcmp(5, 2, xsbms) / 1000;
                var max = dcmp(3, 2, xsbms) / 1000;
                cv = (cv-min)/(max-min)*100;
            }

            $("#cell"+x1).css('width', cv + '%');
            $("#cell"+x1).css('background', getHslColor(cv));
        }

        for (x1 = 0; x1 < 7; x1++) {
            var n2 = w[8] = w[9] = w[10] = w[11] = '';
            var cv = dcmp((x1 * 3) + 29, 3, sbms) / 1000;
            var enW = dcmp(x1 * 6, 6, eW);
            var enA = dcmp(x1 * 6, 6, eA);
            if (x1 == 0) {
                n2 = sbms.charAt(28);
                w[8] = '[A]' + r;
                w[9] = '[W]' + r;
                w[10] = '[mAh]' + r;
                w[11] = '[Wh]' + r;
            }
            ;
            if (x1 == 1 || x1 == 2) {
                pv3 += cv;
            }
            ;
            if (x1 == 3) {
                sv = cv;
            }
            if (x1 == 4) {
                cv = pv3;
            }
            if (x1 == 5) {
                cv = dcmp(0, 3, xsbms) / 1000;
            }
            if (x1 == 6) {
                cv = sv;
            }
            if (x1 != 3) {
                w[3] += sbms1[x1 + 1] + r;
                w[4] += w[8] + n2 + cv.toFixed(3) + r;
                w[5] += w[9] + n2 + (cv * bv).toFixed(1) + r;
                w[6] += w[10] + fN(enA) + r;
                w[7] += w[11] + fN((enW / 10).toFixed(1)) + r;
            }
        }

        for (i = 6; i < 11; i++) {
            htm('d' + i, w[i - 3]);
        }

        $('#infoBarTitle1').html('System type');
        $('#infoBarValue1').html(dcmp(7, 1, xsbms));
        $('#infoBarTitle2').html('Maximum capacity');
        $('#infoBarValue2').html(dcmp(8, 3, xsbms) + sbms1[8]);
        $('#infoBarTitle3').html('System status');
        $('#infoBarValue3').html(dcmp(56, 3, sbms) + r);
        $('#infoBarTitle4').html('Interior temperature');
        $('#infoBarValue4').html(((dcmp(24, 2, sbms) / 10) - 45).toFixed(1) + '&#8451');
        $('#infoBarTitle5').html('Exterior temperature');
        $('#infoBarValue5').html(((dcmp(26, 2, sbms) / 10) - 45).toFixed(1) + '&#8451');
        $('#infoBarTitle6').html('Battery voltage');
        $('#infoBarValue6').html(bv.toFixed(3) + 'V');
        $('#infoBarTitle7').html('Cell &#916');
        $('#infoBarValue7').html(((max1 - min1) * 1000).toFixed(0) + 'mV');
        // htm('d' + 12, 'Type: ' + dcmp(7, 1, xsbms) + ' Cap: ' + dcmp(8, 3, xsbms) + sbms1[8] + ' Status: ' + dcmp(56, 3, sbms) + r + 'SBMS Temp Int: ' + ((dcmp(24, 2, sbms) / 10) - 45).toFixed(1) + '&#8451 Ext: ' + ((dcmp(26, 2, sbms) / 10) - 45).toFixed(1) + '&#8451' + r + 'BattVoltage <Val>' + bv.toFixed(3) + '</Val> V Cell &#916 <Val>' + ((max1 - min1) * 1000).toFixed(0) + '</Val> mV');
    }

}