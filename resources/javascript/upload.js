import Resumable from 'resumablejs/resumable';

export default function () {
    let r = new Resumable({
        fileType: [
            'json',
            'geojson'
        ],
        target: '/upload'
    });
    r.assignBrowse(document.getElementById('btn-layers-upload'));
    r.on('fileAdded', (file, event) => {
        console.log(file);
        r.upload();
    });
    r.on('fileSuccess', (file, message) => {
        console.log(message);
    });
}
