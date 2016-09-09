/**
 * Main based controller module inherited for all controllers
 * @module controllers/main
 */

/** Get Mood Values
*	Single Mood Value is counted according to mood 'create date'.
*   Mood is 0-5 days old  => mood.value * 1
*   Mood is 5-15 days old  => mood.value * 0.8
*   Mood is 15-20 days old  => mood.value * 0.6
*   Mood is 20-30 days old  => mood.value * 0.3
*/
exports.getMoodValues = function(mood) {


	var now = new Date();
	var moodCreated = new Date(mood.created);

	//Time difference in miliseconds
	var dateDiff = now.getTime() - moodCreated.getTime();
	
	var moodValue = 1;
	var moodDivisor = 1;

	if (mood.mood === undefined) {
		return [0,0];
	}

	switch (true) {
		case (dateDiff <= 432000000): //Mood is 0-5 days old
			moodValue = mood.mood;
			break;

		case (dateDiff > 432000000 && dateDiff <= 1296000000): //Mood is 5-15 days old
			moodDivisor = 0.8;
			moodValue = mood.mood * moodDivisor;
			break;

		case (dateDiff > 1296000000 && dateDiff <= 1728000000): //Mood is 15-20 days old
			moodDivisor = 0.6;
			moodValue = mood.mood * moodDivisor;
			break;

		case (dateDiff > 1728000000 && dateDiff <= 2592000000): //Mood is 20-30 days old
			moodDivisor = 0.3;
			moodValue = mood.mood * moodDivisor;
			break;

		default:
			moodValue = mood.mood;

	};
	
	return [moodValue, moodDivisor];
};


/** Get Count Text
*  Return a Text for the count
*/
exports.getCountText = function(iCount) {
  var sText = "";
  var sFirstDigits = "";
  switch(true){
  case ( iCount < 1000 ): sText = iCount+""; break;
  case ( iCount < 10000 ):
    sFirstDigits = String(iCount).charAt(0);
    sText = sFirstDigit + " Tsd";
    break;
  case ( iCount < 100000 ):     
    sFirstDigits = String(iCount).charAt(0) + String(iCount).charAt(1) + "";
    sText = sFirstDigit + " Tsd"
    break;
  }
	return sText + " Moods";
};