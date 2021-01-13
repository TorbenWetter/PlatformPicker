/**
 * @Date:   2021-01-07T20:24:24+01:00
 * @Last modified time: 2021-01-13T20:40:12+01:00
 * @Copyright: Copyright 2020, Heidelberg (Germany)
 */



// The logic behind PlatformPicker: Welcome to the JavaScript-File

// The questions which should be answered; theoretically we could outsource the data to a JSON-File, but for so little questions it is not a problem to store them completly here
var prompts = [
{
	prompt: 'Ein niedriger Preis ist für das Projekt ist',
	weight: 1,
	class: 'group0'
},
{
	prompt: 'Dass die Plattform einsteigerfreundlich (z.B. gute Dokumentation, einfach zu erlernende Programmiersprache) ist, ist',
	weight: 1,
	class: 'group1'
},
{
	prompt: 'Das eine grafische Ausgabe über einen Monitor/Fernseher/Beamer realisiert werden kann, ist',
	weight: 1,
	class: 'group2'
},
{
	prompt: 'Das Projekt benötigt viel Speicherplatz (Arbeitsspeicher und Programmspeicher) für Programme und Grafiken',
	weight: 1,
	class: 'group3'
},
{
	prompt: 'Die Größe des Entwicklungsboards ist',
	weight: 1,
	class: 'group4'
},
{
	prompt: 'Viele (analoge- und/oder digitale-) Ein- und Ausgänge sind für das Projekt:',
	weight: 1,
	class: 'group5'
},
{
	prompt: 'Eine hohe analoge Auflösung der analogen Eingänge ist für das Projekt:',
	weight: 1,
	class: 'group6'
},
{
	prompt: 'Eine Kamera muss an das Projekt angeschlossen werden:',
	weight: 1,
	class: 'group7'
},
{
	prompt: 'Internetfunktionalität ist für das Projekt',
	weight: 1,
	class: 'group8'
},
{
	prompt: 'Das Board sollte Breadboardkompatibel sein',
	weight: 1,
	class: 'group9'
},
{
	prompt: 'Das Board sollte möglichst Open-Source sein:',
	weight: 1,
	class: 'group10'
},
{
	prompt: 'Ein niedriger Stromverbrauch (z.B. für Batteriebetrieb) ist',
	weight: 1,
	class: 'group11'
}
]

// This array stores the values which can get answered
// The stronger agreeance/disagreeance, the higher the weight on the user's answer to the prompt.
var prompt_values = [
{
	value: 'Unverzichtbar',
	class: 'btn-default btn-strongly-agree border-success rounded',
	weight: 10000
},
{
	value: 'Bedeutend',
	class: 'btn-default btn-agree border-success rounded',
	weight: 3,
},
{
	value: 'Wichtig',
	class: 'btn-default btn-neutral border-secondary rounded',
	weight: 0
},
{
	value: 'Weniger wichtig',
	class: 'btn-default btn-disagree border-danger rounded',
	weight: -3
},
{
	value: 'Irrelevant',
	class: 'btn-default btn-strongly-disagree border-danger rounded',
	weight: -5
}
]

// For each prompt, create a list item to be inserted in the list group
function createPromptItems() {

	for (var i = 0; i < prompts.length; i++) {
		var prompt_li = document.createElement('li');
		var prompt_p = document.createElement('p');
		var prompt_text = document.createTextNode(prompts[i].prompt);

		prompt_li.setAttribute('class', 'list-group-item prompt');
		prompt_p.appendChild(prompt_text);
		prompt_li.appendChild(prompt_p);

		document.getElementById('quiz').appendChild(prompt_li);
	}
}

// For each possible value, create a button for each to be inserted into each li of the quiz
// function createValueButtons() {

// 	for (var li_index = 0; li_index < prompts.length; li_index++) {
// 		for (var i = 0; i < prompt_values.length; i++) {
// 			var val_button = document.createElement('button');
// 			var val_text = document.createTextNode(prompt_values[i].value);

// 			val_button.setAttribute('class', 'value-btn btn ' + prompt_values[i].class);
// 			val_button.appendChild(val_text);

// 			document.getElementsByClassName('prompt')[li_index].appendChild(val_button);
// 		}
// 	}
// }
function createValueButtons() {
	for (var li_index = 0; li_index < prompts.length; li_index++) {
		var group = document.createElement('div');
		group.className = 'btn-group btn-group-justified';

		for (var i = 0; i < prompt_values.length; i++) {
			var btn_group = document.createElement('div');
			btn_group.className = 'btn-group';

			var button = document.createElement('button');
			var button_text = document.createTextNode(prompt_values[i].value);
			button.className = 'group' + li_index + ' value-btn btn ' + prompt_values[i].class;
			button.appendChild(button_text);

			btn_group.appendChild(button);
			group.appendChild(btn_group);

			document.getElementsByClassName('prompt')[li_index].appendChild(group);
		}
	}
}

createPromptItems();
createValueButtons();

// Keep a running total of the values they have selected.
// Calculation will sum all of the answers to the prompts using weight of the value * the weight of the prompt.
var total = 0;

// Get the weight associated to group number
function findPromptWeight(prompts, group) {
	var weight = 0;

	for (var i = 0; i < prompts.length; i++) {
		if (prompts[i].class === group) {
			weight = prompts[i].weight;
		}
	}

	return weight;
}

// Get the weight associated to the value
function findValueWeight(values, value) {
	var weight = 0;

	for (var i = 0; i < values.length; i++) {
		if (values[i].value === value) {
			weight = values[i].weight;
		}
	}

	return weight;
}

// When user clicks a value to agree/disagree with the prompt, display to the user what they selected
$('.value-btn').mousedown(function () {
	var classList = $(this).attr('class');
	// console.log(classList); // DEBUG
	var classArr = classList.split(" ");
	// console.log(classArr); // DEBUG
	var this_group = classArr[0];
	// console.log(this_group); // DEBUG

	// If button is already selected, de-select it when clicked and subtract any previously added values to the total
	// Otherwise, de-select any selected buttons in group and select the one just clicked
	// And subtract deselected weighted value and add the newly selected weighted value to the total
	if($(this).hasClass('active')) {
		$(this).removeClass('active');
		total -= (findPromptWeight(prompts, this_group) * findValueWeight(prompt_values, $(this).text()));
	} else {
		// $('[class='thisgroup).prop('checked', false);
		total -= (findPromptWeight(prompts, this_group) * findValueWeight(prompt_values, $('.'+this_group+'.active').text()));
		// console.log($('.'+this_group+'.active').text());
		$('.'+this_group).removeClass('active');

		// console.log('group' + findValueWeight(prompt_values, $('.'+this_group).text()));
		// $(this).prop('checked', true);
		$(this).addClass('active');
		total += (findPromptWeight(prompts, this_group) * findValueWeight(prompt_values, $(this).text()));
	}

	console.log(total);
})



$('#submit-btn').click(function () {
	// After clicking submit, add up the totals from answers
	// For each group, find the value that is active
	$('.results').removeClass('hide');
	$('.results').addClass('show');

	if (total < 0) {
		window.document.location.href = "boards/arduino/nano";
	} else if (total > 0) {
		window.document.location.href = "boards/arduino/nano";
	} else {
		window.document.location.href = "boards/arduino/nano";
	}

	// Hide the quiz after they submit their results
	$('#quiz').addClass('hide');
	$('#submit-btn').addClass('hide');
	$('#retake-btn').removeClass('hide');
})

// Refresh the screen to show a new quiz if they click the retake quiz button
$('#retake-btn').click(function () {
	$('#quiz').removeClass('hide');
	$('#submit-btn').removeClass('hide');
	$('#retake-btn').addClass('hide');

	$('.results').addClass('hide');
	$('.results').removeClass('show');
})
