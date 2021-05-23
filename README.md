# GeoCaching_AddToLists

Tempermonkey script to add a geocache to one or more sets of default lists with one click

## Installation

1. Install Tampermonkey
1. Copy the script (AddToLists.js) to the clipboard
1. Open the Tampermonkey menu (black square with two white dots), and select create new script
1. Delete the generated content and past the copied script from step 2
1. Save the script (file save)

More info on https://www.tampermonkey.net/faq.php

## Setup

1. Go to geocaching.com and search for a cache you want to add to one or more default lists. You should now have a new option below "Add to List", called "Add to Defaults (1)"
2. Now open the tempermonkey menu
3. Find the entry "Geocaching Add to List" and click on "Default lists"
4. Here you can set the sets of default lists.
   In the form Name=list1,list2
   Where Name = the name of the set. It will be shown on the page.
   And list1,list2 are the names of the list to add the cache to (one or more, comma seperated)
   You can add more sets by seperating them with a semicolon (;)
   Eg: Solved=Solved Mysteries;Vacation=My Vacation;SolvedVaction=Solved Mysteries,My Vacation
5. Save

You can always change the list the same way.

## Usage

1. On a geocache page, hover over the option "Add to Default Lists (x)". Where x is the number of lists you added during the setup.
2. You now see the names of the lists
3. Click the option.
4. The cache is saved to the lists.
5. If everything went ok, the option turns green and you see a smiley.
