import { registerBlockType, createBlock } from '@wordpress/blocks';
import './style.scss';

import Edit from './edit';
import save from './save';
// import metadata from './block.json';

// Importing the team-member block
import './team-member';

registerBlockType( 'blocks-course/team-members', {
	edit: Edit,
	save,
	transforms: {
		// from: [
		// 	{
		// 		type: 'block',
		// 		blocks: [ 'core/gallery' ],
		// 		transform: ( attributes ) => {
		// 			console.log( attributes );
		// 			// const innerBlocks = images.map( ( image ) => {
		// 			// 	return createBlock( 'blocks-course/team-member', {
		// 			// 		url: image.url,
		// 			// 		alt: image.alt,
		// 			// 		id: image.id,
		// 			// 	} );
		// 			// } );
		// 			// return createBlock( metadata.name, {
		// 			// 	columns: columns || 2,
		// 			// 	innerBlocks,
		// 			// } );
		// 		},
		// 	},
		// ],
		from: [
			{
				type: 'block',
				blocks: [ 'core/gallery' ],
				transform: ( attributes, innerBlocks ) => {
					const allTeamMembers = innerBlocks.map( ( block ) => {
						return createBlock( 'blocks-course/team-member', {
							url: block.attributes.url,
							alt: block.attributes.alt,
							id: block.attributes.id,
							socialLinks: [
								{
									icon: 'wordpress',
									link: 'https://wordpress.org',
								},
							],
						} );
					} );
					return createBlock(
						'blocks-course/team-members',
						{
							columns: attributes.columns || 2,
						},
						allTeamMembers
					);
				},
			},
			{
				type: 'block',
				blocks: [ 'core/image' ],
				isMultiBlock: true,
				transform: ( attributes ) => {
					const allTeamMembers = attributes.map( ( image ) => {
						return createBlock( 'blocks-course/team-member', {
							url: image.url,
							alt: image.alt,
							id: image.id,
							socialLinks: [
								{
									icon: 'wordpress',
									link: 'https://wordpress.org',
								},
							],
						} );
					} );
					return createBlock(
						'blocks-course/team-members',
						{
							columns:
								attributes.length > 3 ? 3 : attributes.length,
						},
						allTeamMembers
					);
				},
			},
		],
	},
} );
