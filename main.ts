import { ClipboardPasteModal } from 'clipboardPasteModal';
import { ClipboardRemovalModal } from 'clipboardRemovalModal';
import { Editor, MarkdownView, Plugin, addIcon } from 'obsidian';

const clipboardHistory: string[] = []

export default class ClipboardManagerPlugin extends Plugin {
	async onload() {
		if (navigator.clipboard) {
			document.addEventListener('copy', (event: ClipboardEvent) => {
				const copiedText = event.clipboardData?.getData('text/plain');
				if (copiedText != null) {
					this.addToClipboardHistory(copiedText)
				}
			});
			document.addEventListener('cut', (event: ClipboardEvent) => {
				const copiedText = event.clipboardData?.getData('text/plain');
				if (copiedText != null) {
					this.addToClipboardHistory(copiedText)
				}
			  });
		} else {
		console.log('Clipboard API is not supported in this browser.');
		}

		this.addObsidianIcon('obsidian-paste', '⌘V');
		this.addCommand({
			id: "obsidian-paste",
			name: "Obsidian Paste",
			icon: "obsidian-paste",
			editorCallback: (editor: Editor, view: MarkdownView) => {
				new ClipboardPasteModal(this.app, editor, clipboardHistory).open();		
			},
		});

		this.addCommand({
			id: "obsidian-remove-clipboard-content",
			name: "Obsidian Remove Clipboard Content",
			icon: "obsidian-remove-clipboard-content",
			editorCallback: (editor: Editor, view: MarkdownView) => {
				new ClipboardRemovalModal(this.app, editor, clipboardHistory).open();		
			}
		});
	}

	onunload() {

	}

	addToClipboardHistory(content: string) {
		const index = clipboardHistory.indexOf(content, 0);
		if (index > -1) {
			clipboardHistory.splice(index, 1);
		}
		if (content.length > 0) {
			clipboardHistory.push(content);
		}
	}

	addObsidianIcon(iconName: string, iconText: string) {
		const svg = `<text stroke='#000' transform='matrix(2.79167 0 0 2.12663 -34.0417 -25.2084)' xml:space='preserve' text-anchor='start' font-family='monospace' font-size='24' y='44' x='19' stroke-width='0' fill='currentColor'>${iconText}</text>`;
		addIcon(iconName, svg);
	}

}
