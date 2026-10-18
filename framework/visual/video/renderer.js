import { Renderer } from '../../scripts/renderer.js';

export default class VideoRenderer extends Renderer {
    async applyAttributes() {
        await super.applyAttributes();

        const video = this.element.querySelector('.ck-video__media');
        const src = this.xml.getAttribute('src');
        if (!src) throw new Error('CourseKit video: missing src');
        video.src = await this.resources.asset(src);

        const poster = this.xml.getAttribute('poster');
        if (poster) video.poster = await this.resources.asset(poster);
        video.preload = this.xml.getAttribute('preload') || 'metadata';
    }
}
