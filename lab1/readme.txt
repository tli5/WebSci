ITWS 6961 Lab 1
Feb. 10th 2015
Taoran (Tom) Li

Animation Implementation:
The animation is implemented using combinations of jQuery functions slidUp() and fadeTo(). First the fading out message/hashtag will have transparency set to 0, then slideUp will free its space. The callback function will be used to detach the element node from its parent node, and then append to the parent node.

Show User Profile on Google Map
During the loop each tweet's geo coordinates is validated. If the coordinates turn out to be valid, the tweet message will be colored blue, and a 'click' event will be binded to the tweet. Upon click, user profile will show up on Google Map as an infowindow, and the map will center at (through panTo() ) the coordinates associated with that tweet.

Default User Profile Image:
during each loop, original profile image will be attached to each tweet. The image element will be binded with 'error' event, and upon trigger, the element's 'src' attribute will be replaced with the default image's URL. 

Responsive formatting:
responsive formatting is achived through Bootstrap. Both map and tweets sections will shrink horizontally on smaller devices, and the map section will shrink vertically as well. I can't think of any idea to shrink Tweets section vertically without reducing the number of tweets, which may fail the purpose of this lab.

Deployed on the Web:
Google App Engine: http://tweets-ticker.appspot.com/
Github: https://github.com/tli5/tweet-ticker
