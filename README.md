# ResourceOverride Fork - A more powerful & less user friendly version of original plugin.
*To install this forked version:
  1. place all content of this repo into dropbox/onedrive/googledrive synced folder on your computer(or not if you dont want cloud sync)
  2. Go into chrome, plugins and press read uncompressed plugin and select the location where you downloaded this repository
  3. voila.
* uses config.js file instead of webbased ui configuration which means that is can be placed in google drive/one drive/etc and be synced, simply enable chrome developer mode,
  and load unpacked extension from synced directory.
  
* Around 350X less browser slowdown on start(based on window.performance.now() timer tests)
  *   the reason for this is because it uses a config.js file instead which loads instantly AND all ui components are completely stripped of from this fork which makes loading much faster since all bloat is gone
*   Supports regex file replacing: one of the most important feature that was needed in the original plugin. Specify target script on page, and replace it's content with regex replacements...
  * Why is regex replacing superior to regular file override in original?
    * The issue with the complete file override is that many websites use big js frameworks, so in that code one may want to change "var showCommercialBreak = true" to simply false.
    * The issue with this is that this only works until the website developers updates their script, could be something very small that has nothing to do with our change such as an api call.
           Now what is happening is our old file override has all of the OLD content(including our change) and this MAY cause the webpage to not function anymore since it's not up to date...
           so you would have to recopy their updated original script and add your changes yet again... and this cycle continues.
          
    * The way to solve this is by replacing with regex... not as easy, but as close as you get to a permanent solution(do once and forget it).
      * find your target script value or section you wanna change /var showCommercialBreak = true/i and replace it with your choice.
      * This is gonna make sure you get an updated script each time and perform a replace operation just on that specific place, which makes
              this keep on working even if website developers updates their scripts.
              
