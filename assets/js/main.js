$(document).ready(function(){
		var event_lineups_container = $(".event_lineups_overlay");
	var close = event_lineups_container.find(".close");

	var event_lineups = {
		the_festivals: {
			img: "/assets/img/el-the-festivals.jpg",
			content: " <h1>The Festivals</h1><p> <strong>Ugieoba is a combination of seven principal ceremonies including the popular IGUE festival,</strong> during which different activities take place over a 14 day period. During the ceremonies which are held daily, chieftaincy title holders appear in their traditional regalia to dance in front of the Oba, displaying their ‘Eben’ (sword of authority), dance and pay homage to the Oba. Every other citizen joins in homage to the Oba in songs and dances. Ceremonies performed to mark the Ugieoba Festival include: </p><h2>Ugie Erhaoba</h2><p>A ceremony honouring the Oba’s ancestors. </p<h2>Ugie Iron </h2<p>LCelebrated to mark the conflict between the Oba and the seven hereditary chiefs called the Uzamas in which the Oba emerged triumphant. </p<h2>Otue Ugierhoba </h2><p>A celebreation where all chiefs go to the palace to pay homage to the Oba according to their ranks and title. </p><h2>Ugie Emobo </h2><p>Ugie Emobo was added to the original festival by Oba Esigie (c.1504–c.1550) in commemoration of his victory over his brother, Arhuanran in the Edo-Udo war. Emobo is the preserve of the Bards (Ogbelaka) who perform seven different songs and seven different dances - all of which re-enact Oba Esigie’s insanity on the road from Udo. The Oba joins in the bards’ songs and dances and it is the only time in Igue when he sings and dances. It takes place on the sixth day of the Igue festival. </p<h2>Ugie Edohia</h2> <p>This is the day all Benin sons and daughters perform their thanksgiving to God. It is celebrated by everyone in their individual house hold or collectively by ward.</p><h2>Ugie Ewere </h2><p> Ugie Ewere has been a part of the festival from its inception. The Ewere leave depicts good wishes and blessings. The leaf personifies love, peace, unity, community cohesion and deep affection. At the end of the festival, the Ihogbe group dance to the Palace to present the symbolic Ewere leaves to the Oba. Bunches of Ewere plants are distributed to every home and person on the streets and on the highway wishing them a prosperous New Year with good luck and fortune. Ugie Ewere brings the entire festival to an end.</p>"
		},
		the_carnival: {
			img: "/assets/img/el_the_carnival.jpg",
			content: "<h1>The Carnival <span class='sub_head'>Traveling fun and joy</span> </h1><p>The Street Carnival is a parade of people across the streets of Benin, in varying, exciting, colorful and sequined costume. It is juxtaposition of the old and the new, the traditional and the contemporary.</p><p>The carnival celebration features street dance by different groups, a sensuous experience of classic tunes, stand-up concerts, non-stop high energy performances, acrobatics, pyrotechnics and performances by the reveled Benin masquerade group - Ekpo.</p><p>The Street Carnival is a two-day fun filled celebration, with the first day dedicated to children.</p>"
		},
		art_exhibition: {
			img: "/assets/img/el-art-exhibitions.jpg",
			content: "<h1>Art Exhibitions <span class='sub_head'>An exhibition of resilience, culture, creativity and triumphs </span></h1><p>The Edo people have always been famous for their creativity and craftsmanship. The art of the Edos has always served as historical documents and as mnemonic devices to reconstruct the history of this ancient civilization.</p><p>The art exhibition is a two week art event that showcases the resilience, perseverance, struggles and triumphs of the life of the Edo people as depicted in the arts. It features a large collection of exquisite paintings, carvings by the famous royal guild, bronze works and mix-media works. It is the only time when people can get to see the famous diverse art works of the Benin Kingdom together.</p>"
		},
		theatre_presentations: {
			img: "/assets/img/el-theatre-presentations.jpg",
			content: "<h1>Theatre Drama Presentations<span class='sub_head'>A re-enactment of the famous events and cultural life of the Edos</span></h1><p>We explore the cultural vicissitudes, transitions, paradoxes and events that has shaped the life of the Benin kingdom. It is a theatric rendition of famous historical events and life of the Edos from the old, to the present.</p><p>The presentations features plays and musicals that re-enacts the struggles, intrigues and suspense of life as it were and the magnificence of the royal house.</p>"
		},
		beauty_pageant: {
			img: "/assets/img/el-beauty-pageant.jpg",
			content: "<h1>Beauty Pageant<span class='sub_head'>Ugie Carnival Queen - Celebrating the virtues of the Edo Woman</span></h1><p>The beauty pageant is a celebration of the beauty, intelligence, personality, talent, values and virtues of the Edo woman. It is a pageant that displays and rewards the tenacity, grace and industrious nature of the Edo woman and that of participants that understands the culture and values that has made the Edo woman the jewel of households in Benin from time immemorial. </p>"
		},
		award: {
			img: "/assets/img/el-awards.jpg",
			content: "<h1>Oba Erediauwa Award For Excellence<span class='sub_head'>Recognizing achievements and courage</span></h1><p>The Oba Erediauwa Award for excellence is a yearly award that is presented to deserving members of the country, both within and outside the shores of the Benin kingdom, who has distinguished themselves in their endeavours or service to humanity. It honours those that inspires and elevates the people around and beyond them.</p>"
		},
		diaspora: {
			img: "/assets/img/el-diaspora.jpg",
			content: "<h1>DIASPORA CELEBRATES<span class='sub_head'>Celebrating the Benin identity outside the borderlines</span></h1><p>Every year, people abroad with ties to the Benin kingdom uses the Ugie carnival period to flaunt their identity and the rich cultural heritage of their origin. It is a time for Nigerians abroad to come together and celebrate our cultural heritage.</p><p>This years celebrations is billed to hold in the United States, United Kingdom, Canada, Spain and Netherlands.</p>"
		}

	};

	var $el_the_festivals = $("#el_the_festivals");
	var $el_the_carnival = $("#el_the_carnival");
	var $el_art_exhibition = $("#el_art_exhibition");
	var $el_theatre_presentations = $("#el_theatre_presentations");
	var $el_beauty_pageant = $("#el_beauty_pageant");
	var $el_award = $("#el_award");
	var $el_diaspora = $("#el_diaspora");

	var $el_image = event_lineups_container.find(".el_image");
	var $el_content = event_lineups_container.find(".event_lineups_overlay_content");

	$el_the_festivals.on("click", function() {
		update_el("the_festivals");
	});

	$el_the_carnival.on("click", function() {
		update_el("the_carnival");
	});

	//$el_art_exhibition ("click", function() {
	//	update_el("art_exhibition");
	//});

	$el_theatre_presentations.on("click", function() {
		update_el("theatre_presentations");
	});

	$el_beauty_pageant.on("click", function() {
		update_el("beauty_pageant");
	});

	$el_award.on("click", function() {
		update_el("award");
	});

	$el_diaspora.on("click", function() {
		update_el("diaspora");
	});

	$el_art_exhibition.on("click", function() {
		update_el("art_exhibition");
	});

	function update_el(el) {
		Object.keys(event_lineups).forEach(function(key){
			if (key === el) {
				$el_image.attr("src", event_lineups[key].img);
				$el_content.html(event_lineups[key].content);
				event_lineups_container.addClass("elo_show");
				$("html, body").animate({scrollTop: 0}, 1000);
			}
		});
	}


	close.on("click", function() {
		$(this).parent().removeClass('elo_show');
	});
});