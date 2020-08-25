let avions = [['A380'],
              ['B772', 'B773', 'B77W', 'B77L', 'B744', 'B788', 'A332', 'A333', 'A342', 'A343', 'A345', 'A346', 'A350'],
              ['B752', 'B753', 'B762', 'B763', 'A310', 'A306', 'MD11'],
              ['B736', 'B737', 'B738', 'B739', 'A318', 'A319', 'A320', 'A321', 'C130', 'MD82', 'MD90'],
              ['B733', 'B734', 'B735', 'AT43', 'AT72', 'B462', 'CRJ2', 'CRJ3', 'CRJ7', 'ATP', 'E145', 'E170', 'E190'],
              ['BE40', 'B190', 'C25A', 'C25B', 'C510', 'C525', 'C560', 'C56X', 'E120', 'E50P', 'E55P', 'FA10', 'FA20', 'H25B']];

let compagnies = ['AFR', 'DLH', 'EZY', 'EVA', 'DAL', 'AAL', 'BAA', 'LOT', 'FDX']

let wtc = ['S', 'G', 'H', 'K', 'M', 'L'];

let espace = []; // espace[leader][follower] - S:0, G:1, H:2, K:3, M:4, L:5
espace[0] = [3, 4, 5, 5, 6, 8]; // esp derriere S
espace[1] = [3, 3, 4, 4, 5, 7]; // esp derriere G
espace[2] = [3, 3, 3, 3, 4, 6]; // esp derriere H
espace[3] = [3, 3, 3, 3, 3, 5]; // esp derriere K
espace[4] = [3, 3, 3, 3, 3, 4]; // esp derriere M
espace[5] = [3, 3, 3, 3, 3, 3]; // esp derriere L

let indiceLeader, indiceFollower, avionLeader, avionFollower, l2LeaderA, l2LeaderB, l2FollowerA, l2FollowerB;

let $elL0 = $('.ligne0');
let $elSectionRadar = $('#section-radar');
let $elL1Leader = $('#ligne1-leader');
let $elL1Follower = $('#ligne1-follower');
let $elL2Leader = $('#ligne2-leader');
let $elL2Follower = $('#ligne2-follower');
let $elScore = $('#score');
let $elBonneRep = $('#bonne-rep');
let $elMauvaiseRep = $('#mauvaise-rep');
let score = 0;
let total = 0;
let l2Alternate, l2Timer;

function nbAleatoire(min, max) {
    let nb = min + (max-min+1)*Math.random();
    return Math.floor(nb);
}

function indicatifAleatoire() {
    return compagnies[nbAleatoire(0, compagnies.length - 1)] +  nbAleatoire(10,9999)
}

function l2Display() {
    if (l2Alternate === true) {
        $elL2Leader.text(l2LeaderB);
        $elL2Follower.text(l2FollowerB);
        l2Alternate = false;
    } else {
        $elL2Leader.text(l2LeaderA);
        $elL2Follower.text(l2FollowerA);
        l2Alternate = true;
    }
}

function poserQuestion() {
    indiceLeader = nbAleatoire(0,4);
    indiceFollower = nbAleatoire(indiceLeader + 1 ,5);
    avionLeader = avions[indiceLeader][nbAleatoire(0,avions[indiceLeader].length - 1)];
    avionFollower = avions[indiceFollower][nbAleatoire(0,avions[indiceFollower].length - 1)];
    l2LeaderA = '038 ' + avionLeader;
    l2LeaderB = '038 ' + wtc[indiceLeader] + '-18';
    l2FollowerA = '038 ' + avionFollower;
    l2FollowerB = '038 ' + wtc[indiceFollower] + '-18';
    l2Alternate = true;
    let indicatifLeader = indicatifAleatoire();
    let indicatifFollower = indicatifAleatoire();
    while (indicatifLeader === indicatifFollower) {
        indicatifFollower = indicatifAleatoire();
    }
    $elL1Leader.text(indicatifLeader);
    $elL1Follower.text(indicatifFollower);
    $elL2Leader.text(l2LeaderA);
    $elL2Follower.text(l2FollowerA);
    l2Timer = setInterval(l2Display, 2000);
}

function verifier(reponse) {
    if(reponse == espace[indiceLeader][indiceFollower]) {
        $elBonneRep.fadeIn(200).delay(300).fadeOut(200);
        $elSectionRadar.css('opacity',0).delay(500).fadeTo(200, 1);
        score ++;
        total ++;
        $elScore.text(score + ' / ' + total);
        clearInterval(l2Timer);
        poserQuestion();
    } else {
        $elMauvaiseRep.fadeIn(200).delay(300).fadeOut(200);
        if (reponse < espace[indiceLeader][indiceFollower]) {
            $elL0.css('visibility','visible');
            setTimeout(function(){
                $elL0.css('visibility','hidden');
                setTimeout(function(){
                    $elL0.css('visibility','visible');
                    setTimeout(function(){ $elL0.css('visibility','hidden'); }, 300);
                }, 300);
             }, 300);
        }
        total++;
        $elScore.text(score + ' / ' + total);
    }
}

$(function(){
    poserQuestion();
    
    $('.reponse').click(function() {
        verifier($(this).attr('id'));
    });
    
});
