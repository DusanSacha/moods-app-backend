/**
 * Main based controller module inherited for all controllers
 * @module controllers/main
 */

/** Get Mood Value 
*	Single Mood Value is counted according to mood 'create date'.
*   Mood is 0-5 days old  => mood.value * 1
*   Mood is 5-15 days old  => mood.value * 0.8
*   Mood is 15-20 days old  => mood.value * 0.6
*   Mood is 20-30 days old  => mood.value * 0.3
*/
exports.getMoodValue = function(mood) {


	var now = new Date();
	var moodCreated = new Date(mood.created);

	//Time difference in miliseconds
	var dateDiff = now.getTime() - moodCreated.getTime();
	
	var moodValue = 1;

	switch (true) {
		case (dateDiff <= 432000000): //Mood is 0-5 days old
			moodValue = mood.mood;
			break;

		case (dateDiff > 432000000 && dateDiff <= 1296000000): //Mood is 5-15 days old
			moodValue = mood.mood * 0.8;
			break;

		case (dateDiff > 1296000000 && dateDiff <= 1728000000): //Mood is 15-20 days old
			moodValue = mood.mood * 0.6;
			break;

		case (dateDiff > 1728000000 && dateDiff <= 2592000000): //Mood is 20-30 days old
			moodValue = mood.mood * 0.3;
			break;

		default:
			moodValue = mood.mood;

	};
	
	return moodValue;
};