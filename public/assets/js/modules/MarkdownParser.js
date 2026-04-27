export class MarkdownParser {

    parse(markdown) {
        if (!markdown) return '';

        let text = markdown.replace(/\r\n/g, '\n');

        const codeBlocks = [];
        text = text.replace(/```(\w*)\n([\s\S]*?)```/g, (_match, lang, code) => {
            codeBlocks.push({ lang, code: this.escapeHtml(code.trimEnd()) });
            return `\n%%CODE_${codeBlocks.length - 1}%%\n`;
        });

        const inlineCodes = [];
        text = text.replace(/`([^`\n]+)`/g, (_match, code) => {
            inlineCodes.push(this.escapeHtml(code));
            return `%%INLINE_${inlineCodes.length - 1}%%`;
        });

        const blocks = text.split(/\n{2,}/);
        const htmlParts = [];

        for (let block of blocks) {
            block = block.trim();
            if (!block) continue;

            const codePlaceholder = block.match(/^%%CODE_(\d+)%%$/);
            if (codePlaceholder) {
                const cb = codeBlocks[parseInt(codePlaceholder[1])];
                const langAttr = cb.lang ? ` class="language-${cb.lang}"` : '';
                htmlParts.push(`<div class="code-block"><pre><code${langAttr}>${cb.code}</code></pre></div>`);
                continue;
            }

            if (/^---+$/.test(block)) {
                htmlParts.push('<hr>');
                continue;
            }

            const headingMatch = block.match(/^(#{1,4})\s+(.+)$/);
            if (headingMatch) {
                const level = headingMatch[1].length;
                htmlParts.push(`<h${level}>${this.inlineFormat(headingMatch[2], inlineCodes)}</h${level}>`);
                continue;
            }

            if (/^>\s/.test(block)) {
                const lines = block.split('\n').map(l => l.replace(/^>\s?/, '')).join('<br>');
                htmlParts.push(`<blockquote>${this.inlineFormat(lines, inlineCodes)}</blockquote>`);
                continue;
            }

            const ulLines = block.split('\n');
            if (ulLines.every(l => /^[-*]\s/.test(l.trim()) || !l.trim())) {
                const items = ulLines
                    .filter(l => /^[-*]\s/.test(l.trim()))
                    .map(l => `<li>${this.inlineFormat(l.trim().replace(/^[-*]\s/, ''), inlineCodes)}</li>`)
                    .join('');
                htmlParts.push(`<ul>${items}</ul>`);
                continue;
            }

            const olLines = block.split('\n');
            if (olLines.every(l => /^\d+\.\s/.test(l.trim()) || !l.trim())) {
                const items = olLines
                    .filter(l => /^\d+\.\s/.test(l.trim()))
                    .map(l => `<li>${this.inlineFormat(l.trim().replace(/^\d+\.\s/, ''), inlineCodes)}</li>`)
                    .join('');
                htmlParts.push(`<ol>${items}</ol>`);
                continue;
            }

            const paragraphContent = block.split('\n').join('<br>');
            htmlParts.push(`<p>${this.inlineFormat(paragraphContent, inlineCodes)}</p>`);
        }

        return htmlParts.join('\n');
    }

    inlineFormat(text, inlineCodes) {
        text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');
        text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

        text = text.replace(/%%INLINE_(\d+)%%/g, (_match, idx) => {
            return `<code>${inlineCodes[parseInt(idx)]}</code>`;
        });

        return text;
    }

    escapeHtml(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }
}
