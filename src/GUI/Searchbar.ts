import * as itowns from 'itowns';


function addActive(htmlElements: HTMLCollection, index: number) {
    if (!htmlElements) { return index; }

    removeAllActives(htmlElements);
    if (index >= htmlElements.length) {
        index = 0;
    } else if (index < 0) {
        index = (htmlElements.length - 1);
    }

    htmlElements[index]?.classList.add('active');

    return index;
}


function removeAllActives(htmlElements: HTMLCollection) {
    for (let i = 0; i < htmlElements.length; i++) {
        htmlElements[i].classList.remove('active');
    }
}

function eraseSuggestionList(form: HTMLFormElement) {
    let lastChild;
    while (form.children.length > 1) {
        lastChild = form.lastChild;
        if (lastChild) form.removeChild(lastChild);
    }
}

type GeocodingOptions = {
    url: URL,
    parser: Function,
    onSelected?: Function
};

type SearchbarOptions = {
    parentElement: HTMLElement,
    width: number,
    height: number,
    position: string,
    translate: { x: number, y: number },
    fontSize: number,
    maxSuggestionNumber: number,
    placeholder: string
};

class Searchbar {
    #_onSelected;
    parentElement: HTMLElement;
    domElement: HTMLElement;

    constructor(geocodingOptions: GeocodingOptions,
                options: SearchbarOptions) {
        this.#_onSelected = geocodingOptions.onSelected ?? (() => {});

        this.domElement = document.createElement('div');
        this.domElement.id = 'widgets-searchbar';
        this.domElement.style.height = 'auto';
        this.domElement.style.width = `${options.width}px`;
        this.domElement.style.height = `${options.height}px`;

        this.parentElement = options.parentElement;
        this.parentElement.appendChild(this.domElement);

        const form = document.createElement('form');
        form.setAttribute('autocomplete', 'off');
        form.id = 'searchbar-autocompletion-form';
        this.domElement.appendChild(form);

        const input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.setAttribute('name', 'mySearch');
        input.setAttribute('placeholder', options.placeholder);
        input.style.height = `${options.height}px`;
        input.style.fontSize = `${options.fontSize}px`;
        form.appendChild(input);

        // currentFocus variable stores the index of the suggestions that is
        // focused by user, either with mouse or arrow keys.
        let currentFocus = -1;
        let attr;

        input.addEventListener('input', () => {
            const value = input.value;

            // Close any already opened list of autocompleted values
            eraseSuggestionList(form);

            currentFocus = -1;

            if (!value) { return false; }

            geocodingOptions.url.searchParams.set('text', value);

            itowns.Fetcher.json(geocodingOptions.url.toString()).then((geocodingResult) => {
                const result = geocodingOptions.parser(geocodingResult);

                let i = 0;
                result.forEach((info: any, location: any) => {
                    // Stop looping through the map if enough location have been proceeded.
                    if (i === Math.min(
                        result.size,
                        options.maxSuggestionNumber,
                    )) { return; }
                    const mapIndex = i;
                    i++;

                    const index = location.toUpperCase().indexOf(value.toUpperCase());

                    if (index > -1) {
                        const autocompleteItem = document.createElement('div');

                        autocompleteItem.style.minHeight = input.style.height;
                        autocompleteItem.style.fontSize = `${options.fontSize}px`;

                        // Make the matching letters bold.
                        const start = location.slice(0, index);
                        const bold = location.slice(index, index + value.length);
                        const end = location.slice(index + value.length, location.length);

                        autocompleteItem.innerHTML = `<p>${start}<strong>${bold}</strong>${end}</p>`;
                        // Store the current location value as an attribute of autocompleteItem div.
                        autocompleteItem.setAttribute('location', location);

                        form.appendChild(autocompleteItem);

                        autocompleteItem.addEventListener('mouseover', () => {
                            removeAllActives(form.children);
                            currentFocus = mapIndex;
                            autocompleteItem.classList.add('active');
                        });

                        autocompleteItem.addEventListener('click', () => {
                            this.#_onSelected(info);

                            attr = autocompleteItem.getAttribute('location');
                            if (attr) eraseSuggestionList(form);
                        });
                    }
                });
            });
        });


        // When searchbar is positioned at the bottom of the screen (therefore
        // is a flex with `column-reverse` direction, we must exchange up and
        // down arrow actions.
        const topOrBottom = options.position.includes('top') ? 1 : -1;

        input.addEventListener('keydown', (event) => {
            event.stopPropagation();
            const completionSuggestions = form.getElementsByTagName('div');

            switch (event.code) {
                case 'Escape':
                    eraseSuggestionList(form);
                    input.value = '';
                    this.domElement.focus();
                    break;
                case 'ArrowDown':
                    event.preventDefault();
                    currentFocus = addActive(completionSuggestions, currentFocus + topOrBottom);
                    break;
                case 'ArrowUp':
                    event.preventDefault();
                    currentFocus = addActive(completionSuggestions, currentFocus - topOrBottom);
                    break;
                case 'Enter':
                    event.preventDefault();
                    if (completionSuggestions[Math.max(currentFocus, 0)]) {
                        completionSuggestions[Math.max(currentFocus, 0)].click();
                        this.domElement.focus();
                    }
                    break;
                default:
                    break;
            }
        });

        // User clicks the searchbar.
        input.addEventListener('focus', () => {
            form.classList.add('focus');
        });
        // User clicks out of the searchbar.
        input.addEventListener('blur', () => {
            form.classList.remove('focus');
            removeAllActives(form.children);
        });
        // Cursor leaves the searchbar.
        form.addEventListener('mouseleave', () => {
            removeAllActives(form.children);
            currentFocus = -1;
        });
    }
}


export default Searchbar;
