// quizz
const quizzList = {
    "Application Web": {
        image: "img/web.jpg",
        questions: "json/quizzweb.json"
    },
    "JavaScript": {
        image: "img/javascript.png",
        questions: "json/quizzjavascript.json"
    },
    "Le XXème Siècle": {
        image: "img/dates20.jpg",
        questions: "json/quizzdates20.json"
    },
    "Nintendo": {
        image: "img/nintendo.jpg",
        questions: "json/quizznintendo.json"
    },
    "Trouver le Nombre": {
        image: "img/nombres.jpg",
        questions: "json/quizznombres.json"
    },
    "Microsoft": {
        image: "img/microsoft.jpg",
        questions: "json/quizzmicrosoft.json"
    },
    "PHP": {
        image: "img/PHP.jpg",
        questions: "json/quizzphp.json"
    },
    "Méandres dInternet": {
        image: "img/internet.jpg",
        questions: "json/quizzinternet.json"
    }
};

// variables d'état du quizz
let quizzState = {
    currentQuestion: 0,
    playerScore: 0,
    questions: [],
    quizzName: "",
    level: ""
};

// lancement 
$(document).ready(function() {
    $('header').html('<h1>Quizz World</h1>');
    showQuizzSelection();
});

// affiche la sélection des quizz
function showQuizzSelection() {
    const container = $('#app-container');
    const template = $('#template-quizz-selection').html();
    container.html(template);

    for (const quizzName in quizzList) {
        const quizz = quizzList[quizzName];
        const quizzBox = $('#template-quizz-box').html();
        const $quizzBox = $(quizzBox);
        
        $quizzBox.find('h3').text(quizzName);
        $quizzBox.find('img').attr({
            src: quizz.image,
            alt: quizzName
        });

        const levelsHtml = `
            <label>
                <input type="radio" name="level-${quizzName}" value="debutant"> Débutant
            </label>
            <label>
                <input type="radio" name="level-${quizzName}" value="confirme"> Confirmé
            </label>
            <label>
                <input type="radio" name="level-${quizzName}" value="expert"> Expert
            </label>
        `;
        
        $quizzBox.find('.levels').html(levelsHtml)
            .find('input[type="radio"]')
            .click(function() {
                const level = $(this).val();
                const levelText = level === 'debutant' ? 'Débutant' : 
                                level === 'confirme' ? 'Confirmé' : 'Expert';
                askName(levelText, quizzName, quizz.image);
            });

        $('#quizz-container').append($quizzBox);
    }
}

// demande le nom du joueur
function askName(level, quizzName, image) {
    Swal.fire({
        title: "Quel est votre nom ?",
        input: "text",
        showCancelButton: true,
        confirmButtonText: "Jouer !"
    }).then((result) => {
        if (result.value) {
            showQuizzIntro(result.value, level, quizzName, image);
        }
    });
}

// affiche l'introduction du quizz
function showQuizzIntro(name, level, quizzName, image) {
    const template = $('#template-quizz-intro').html();
    const $intro = $(template);
    
    $intro.find('h2').text(`${quizzName} - Niveau ${level}`);
    $intro.find('.name').text(name);
    $intro.find('img').attr({
        src: image,
        alt: quizzName
    });
    $intro.find('button').click(() => loadQuizz(quizzName, level));
    
    $('#app-container').html($intro);
}

// charge le quizz sélectionné
function loadQuizz(quizzName, level) {
    const quizz = quizzList[quizzName];
    
    if (!quizz) {
        Swal.fire("Erreur", "Quizz non trouvé", "error");
        return showQuizzSelection();
    } 
    
    $.getJSON(quizz.questions)
        .done(data => {
            quizzState.questions = data.quizz[level.toLowerCase() === 'confirmé' ? 'confirmé' : 
                                   level.toLowerCase() === 'expert' ? 'expert' : 'débutant'];
            quizzState.quizzName = quizzName;
            quizzState.level = level;
            quizzState.currentQuestion = 0;
            quizzState.playerScore = 0;
            startQuizz();
        })
        .fail(() => Swal.fire("Erreur", "Problème de chargement", "error"));
}

// lance le quizz
function startQuizz() {
    const template = $('#template-quizz-screen').html();
    const $quizzScreen = $(template);
    
    $quizzScreen.find('h2').text(`${quizzState.quizzName} - Niveau ${quizzState.level}`);
    $('#app-container').html($quizzScreen);

    $('#next-btn').click(() => {
        quizzState.currentQuestion++;
        showQuestion(quizzState.currentQuestion);
    });

    showQuestion(0);
}

// affiche une question
function showQuestion(index) {
    if (index >= quizzState.questions.length) {
        showFinalResults();
        return;
    }

    const question = quizzState.questions[index];
    $('#progress').text(`Question ${index + 1}/${quizzState.questions.length}`);
    $('#next-btn').prop('disabled', true);
    $('#answer-box').removeClass('right wrong').text('Posez votre réponse ici !!!');
    $('#info-box').empty().hide();

    const questionTemplate = $('#template-question').html();
    const $question = $(questionTemplate);
    
    $question.attr('data-answer', question.réponse);
    $question.find('h3').text(question.question);
    
    const answers = [...question.propositions].sort(() => Math.random() - 0.5);
    const answersHtml = answers.map(answer => 
        `<div class="answer" draggable="true" data-value="${answer}">${answer}</div>`
    ).join('');
    
    $question.find('.answers').html(answersHtml);
    $('#question-box').html($question);
    
    setupDragDrop(question);
}

// drag and drop pour une question
function setupDragDrop(question) {
    let answered = false;

    $('.answer')
        .on('dragstart', function(e) {
            if (answered) return false;
            e.originalEvent.dataTransfer.setData('text', $(this).data('value'));
            $(this).addClass('dragging');
        })
        .on('dragend', function() {
            $(this).removeClass('dragging');
        });

    $('#answer-box')
        .on('dragover', function(e) {
            if (!answered) {
                e.preventDefault();
                $(this).addClass('hover');
            }
        })
        .on('dragleave', function() {
            $(this).removeClass('hover');
        })
        .on('drop', function(e) {
            if (answered) return;
            
            e.preventDefault();
            $(this).removeClass('hover');
            
            const answer = e.originalEvent.dataTransfer.getData('text');
            $(this).text(answer);
            answered = true;
            
            $('.answer').css('opacity', '0.5').attr('draggable', 'false');
            
            if (answer === question.réponse) {
                $(this).addClass('right');
                quizzState.playerScore++;
                $('#score').text(quizzState.playerScore);
            } else {
                $(this).addClass('wrong');
                $(`.answer[data-value="${question.réponse}"]`).addClass('right').css('opacity', '1');
            }
            
            if (question.anecdote) {
                $('#info-box').html(`<p>${question.anecdote}</p>`).show();
            } else {
                $('#info-box').hide();
            }
            $('#next-btn').prop('disabled', false);
        });
}

// affiche les résultats finaux
function showFinalResults() {
    const percentage = Math.round((quizzState.playerScore / quizzState.questions.length) * 100);
    const template = $('#template-results').html();
    const $results = $(template);
    
    $results.find('.score-text').text(`Tu as obtenu ${quizzState.playerScore} bonnes réponses sur ${quizzState.questions.length}`);
    $results.find('.percentage').text(`(${percentage}%)`);
    $results.find('button').click(showQuizzSelection);
    
    $('#app-container').html($results);
}
 