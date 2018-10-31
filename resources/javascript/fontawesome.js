import { library, dom } from '@fortawesome/fontawesome-svg-core';
import {
    faGithub
} from '@fortawesome/free-brands-svg-icons';
import {
    faImage,
	faMap,
    faQuestionCircle,
    faTrashAlt
} from '@fortawesome/free-regular-svg-icons';
import {
    faCaretLeft,
    faCodeBranch,
    faCog,
	faDatabase,
    faInfo,
    faInfoCircle,
    faLink,
    faMapMarkerAlt,
    faPlusCircle,
    faSpinner,
    faUpload,
    faVectorSquare
} from '@fortawesome/free-solid-svg-icons';

library.add(
    faCaretLeft,
    faCodeBranch,
    faCog,
    faDatabase,
    faGithub,
    faImage,
    faInfo,
    faInfoCircle,
    faLink,
	faMap,
    faMapMarkerAlt,
    faPlusCircle,
    faQuestionCircle,
    faSpinner,
    faTrashAlt,
    faUpload,
    faVectorSquare
);

dom.watch();
