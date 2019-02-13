# Huge Books List React App

This books list app contains one million book entries where each entry should have a name, an author, a genre and a publish date. The authors should have a name and a gender.
\
All this data is scrollable, meaning no pagination whatsoever, and includes sorting by book and author name as well as a filter by book genre and author gender.
\
Plus, icons to indicate books in the "horror" genre published on Halloween and books in the "finance" genre published on the last Friday of any month.

## Usage
* To install the dependencies: `npm install`
* To start the local http server: `npm run start`
* To run the tests: `npm run test` (npm alias: `npm test`)

## Software Stack
* React v16
* Material UI v3
* Babel v7
* Webpack v4
* Jest v24
* Enzyme v3

## JSON Format
Generated the books list using [Mockaroo](https://mockaroo.com/schemas/new).
\
The script `generate_db.sh` contains all the instructions to fetch one million of records in the following JSON format:
```
[
    {
        "title": "",
        "author": {
            "name": "",
            "gender": ""
        },
        "genre": "",
        "publish_date": ""
    },
    (...)
]
```

## Components structure
Since there is no **"one way of doing things"** when it comes to components organisation, I decided to go for the simplest solution and just put each component as a single file in ``components/`` folder and then use another ``__tests__`` folder underneath it for all the tests.

If this was going to be a bigger project with a lot more styles, tests, etc. I would go for a different approach where each component would be a folder inside ``components/`` folder, and inside of them, there would be a file for the component logic, another for styles, tests, etc.
\
Making it a lot easier to manage but also to extract them into their NPM package if required with almost no extra work apart from updating ``import`` paths.

I had this initially planned, and I wanted to avoid using ``index`` filename and rather go with something more like ``ListView`` for a better context in editors. Given that using something like ``import myComponent from '../myComponent/myComponent'`` was not ideal at all, ``package.json`` could come handy and set ``"main": "myComponent"`` property to allow ``import myComponent from '../myComponent'``.
\
One of the problems was that on the Babel side, the configuration was not picked up as it would stop looking for ``.babelrc`` as soon as it finds a ``package.json``. There were alternatives (one of them which I only found in later stages was [babel.config.js](https://babeljs.io/docs/en/config-files#project-wide-configuration)) nonetheless it was already proving to be a complex solution (at least for this particular case) since it required an extra step of having a ``package.json`` per component.

## Tests
In terms of tests, I did not go too far as I just wanted to demonstrate a few examples and even on ``async`` scenarios, I am comfortable to handle such cases.
\
That is the reason for having basic tests because e2e testing is another possibility (that got a lot easier with [Puppeteer](https://github.com/GoogleChrome/puppeteer)) so there were too many options to cover where most of them are decided on per project basis.

## Applied logic
I have worked with this kind of large datasets, and so I knew beforehand that displaying one million entries in a page is not feasible at all, which was one of the lessons that I learned when I started to work on mobile devices where it has even fewer resources than desktops.
\
Applying the same concept which was design/acknowledge on mobiles where it only needs to render what is visible since the user can not see beyond what is presented in the screen. I created a scrollable container where it is height would be calculated based on the entry height times the number of entries.
\
Then a listener for the ``scroll`` event is set up to grab ``scrollTop`` property to determine what data should be presented at that given position of the screen, using the array indexes to show from **position A** to **position B**.

Regarding the filtering logic, I initially had a different implementation idea to avoid having a second array which would save me a few kilobytes (or megabytes, depending on the amount of data). It would not render from **position A** to **position B** based on the number of visible entries, but rather from **position A** to **position B** based on the number of records that matched the filters.
\
Not only that but it would also need to be calculated on every single scroll. However, this logic proved to be a lot more complicated and inefficient from a computational view, although in terms of memory management it was a lot better.

More to come on [Things that can be improved](#markdown-header-things-that-can-be-improved) and [Sorting algorithm](#markdown-header-sorting-algorithm).

## Encountered issues
Since every browser has a different render engine they also have different height limitations, Chrome supports up to 33554400px and Firefox up to 17895700px. Meaning each table row in Firefox had to be 17px or less (17895700px / 1000000 = 17,8957), what is still acceptable but I wanted to find a solution that would work beyond this limitation.
\
So this leads me to take a different approach by dividing the height of the dataset by two (since it works for this specific case) and then on each ``scroll`` event the ``scrollTop`` is multiplied by times two. Effectively what this logic is making is moving between each row two times faster than it usually would, while still be able to show content at the right size.

The second issue that I noticed was using ``padding-top`` to position the table at the visible area of the scrolling container. After a while, the height of the page starts to decrease (visible through computed stylesheets on inspector) because internally it seems to sum the height of the scrolling container and the padding. Once that sum goes beyond the height limitation, the browser starts to decrease the height of the element.
\
The alternative solution that does not cause this kind of issues because it is independent, where it can even be set outside of the visible screen, is ``position: absolute``. Once the previous implementation was replaced with it and started to set ``top`` instead of ``padding-top``, everything was very smooth and no other issues where visible.

## Things that can be improved
Like any other piece of software there is always room for improvements, and in this particular case:

- **Web Workers** — The usage of Web Workers would have made much more sense here to move all the fetching, sorting and filtering logic into it to avoid any possible user interaction degradation while those intensive tasks are running. I have created, on purpose, alternatives to demonstrate how to handle it in case there is no browser support for such a feature. Two of them being a CSS loader animation instead of a javascript one and a ``setTimeout`` before processing the sort function to give the browser some time to at least finish the user interaction stack and close the dropdown. The much better user experience would be either setting a spinner on top of the table while sorting the data in the Web Worker and then remove it once done, or, allow the user to still scroll through the data while sorting is being processed and update the table when finished. I would see both approaches are feasible and it is mostly a production/business call to see what fits best. Being aware that the first option the memory management would be better as the data could be transferred instead of copied, limiting its accessibility on the main thread - the reason why the spinner would be shown preventing from rendering new data that is no longer available. See [more here](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers#Transferring_data_to_and_from_workers_further_details).
- **Data normalisation** — The sorting and filter logic got more complex because of the nested object inside ``author``, replacing with individual properties would make it easier. Right after it, I would try to convert the entry object into an array to double check the performance in such a large dataset.
- **Filtering** — Although the current implementation is fast enough to avoid user interaction degradation, especially for the dataset size, in terms of memory consumption is still far from good.
- **Sorting** — More about this in the next section.

### Sorting algorithm
This topic was the most I researched but the least I worked on.
\
To start it is a costly computation, and so the usage of Web Workers would be a must - for such amount of entries - and then the actual sort algorithm would probably need to be pre-calculated to avoid huge delays between user interactions - between when they clicked and when the data is shown.
\
I knew the bubble and insertion sort but had to read about merge, radix and timsort. The problem of these algorithms is that it is mostly designed for sorting numbers and not strings, especially when considering languages other than English. From what I was able to look my bets would be between radix sort and timsort, where the last one is implemented on **Chrome 70+** meaning on my local environment I was able to confirm that it takes just a few seconds - only on the first run, subsequential runs drop to 600-700ms.
\
I did try radix sort but not on the generated dataset although it was still one million entries to notice that nothing significant would be improved.

All of this leads me to think that the best solution would be "outside" of the sorting algorithms. An idea that I explored was sorting only up to the number of visible entries in the screen to get immediate data to the user. In this scenario, I'm assuming that I would be able to figure out a custom sort algorithm to detect the first 100 entries, for example, simply by iterating all entries. Then pick up the positions of the first "a" character and start from there which would allow to send that first sorted data back to the main thread and continue the rest of the process in chunks for when the user starts to scroll.

All of this to say that I couldn't figure out a correct solution for this problem but I am very curious to know how others would solve it, probably there is a more straightforward way which I am missing.
