import ReactDOM from 'react-dom/client';

import {SplashScreen} from './Components/Main';


function main() {
    const root = ReactDOM.createRoot(
        document.getElementById('root')! // always non-null
    );

    root.render(<SplashScreen />);
}

export default main;
