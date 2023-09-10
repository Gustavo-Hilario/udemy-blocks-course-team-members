import { __ } from '@wordpress/i18n';

import { registerBlockType } from '@wordpress/blocks';

import Edit from './edit';
import Save from './save';

registerBlockType( 'blocks-course/team-member', {
	// Similar to what's in the block.json file
	title: __( 'Team Member', 'team-members' ),
	description: __( 'Block showing a single team member', 'team-members' ),
	icon: 'admin-users',
	parent: [ 'blocks-course/team-members' ],
	supports: {
		// Removes support for an HTML mode
		html: false,
	},
	attributes: {
		name: {
			type: 'string',
			source: 'html',
			selector: 'h4',
		},
		bio: {
			type: 'string',
			source: 'html',
			selector: 'p',
		},
		id: {
			type: 'number',
		},
		alt: {
			type: 'string',
			source: 'attribute',
			selector: 'img',
			attribute: 'alt',
			default: '',
		},
		url: {
			type: 'string',
			source: 'attribute',
			selector: 'img',
			attribute: 'src',
			default: '',
		},
		socialLinks: {
			type: 'array',
			default: [
				{ link: 'https://facebook.com', icon: 'facebook' },
				{ link: 'https://twitter.com', icon: 'twitter' },
				{ link: 'https://instagram.com', icon: 'instagram' },
				{ link: 'https://linkedin.com', icon: 'linkedin' },
				{ link: 'https://youtube.com', icon: 'youtube' },
			],
		},
	},
	edit: Edit,
	save: Save,
} );
