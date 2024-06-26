import { __ } from '@wordpress/i18n';

import {
	useBlockProps,
	RichText,
	MediaPlaceholder,
	BlockControls,
	MediaReplaceFlow,
	InspectorControls,
	// store will help us skip manually adding "core/block-editor" to the Select function
	store as BlockEditorStore,
} from '@wordpress/block-editor';

import {
	Spinner,
	withNotices,
	ToolbarButton,
	Panel,
	PanelBody,
	TextareaControl,
	SelectControl,
	Icon,
	Tooltip,
	TextControl,
	Button,
	Flex,
	FlexItem,
} from '@wordpress/components';

// Sortable Import with DndKit
import {
	DndContext,
	useSensor,
	useSensors,
	PointerSensor,
	KeyboardSensor,
} from '@dnd-kit/core';

import {
	SortableContext,
	horizontalListSortingStrategy,
	arrayMove,
} from '@dnd-kit/sortable';

import { restrictToHorizontalAxis } from '@dnd-kit/modifiers';

import SortableItem from './sortableItem';

import { useEffect, useState, useRef } from '@wordpress/element';
import { useSelect } from '@wordpress/data';

// Learn More: https://developer.wordpress.org/block-editor/packages/packages-data/
import { usePrevious } from '@wordpress/compose';

import { isBlobURL, revokeBlobURL } from '@wordpress/blob';

function Edit( {
	attributes,
	setAttributes,
	context,
	noticeOperations,
	noticeUI,
	isSelected,
} ) {
	const { name, bio, url, alt, id, socialLinks } = attributes;

	// Handling Image Logic
	const prevURL = usePrevious( url );

	const [ blobURL, setBlobURL ] = useState();

	// Get the image object from the media library. It should update every time the ID changes
	const imageObject = useSelect(
		( select ) => {
			const { getMedia } = select( 'core' );
			return id ? getMedia( id ) : null;
		},
		[ id ]
	);

	// console.log( imageObject );

	// Get the image sizes from the settings (defined in PHP/Theme settings)
	const imageSizes = useSelect( ( select ) => {
		return select( BlockEditorStore ).getSettings().imageSizes;
	}, [] );

	// console.log( imageSizes );

	// Compare (Media Library and PHP config) and return an array of image sizes if they match in both places
	const imageSizeOptions = imageSizes
		.filter( ( imageSize ) => {
			return (
				imageObject && imageObject.media_details.sizes[ imageSize.slug ]
			);
		} )
		.map( ( imageSize ) => {
			return {
				value: imageObject.media_details.sizes[ imageSize.slug ]
					.source_url,

				label: imageSize.name,
			};
		} );

	// console.log( imageSizeOptions );

	const titleRef = useRef( () => {} );

	// Check if is there any saved blob URL
	useEffect( () => {
		// console.log( 'Loading for the first tiem' );
		if ( ! id && isBlobURL( url ) ) {
			setAttributes( { url: undefined, alt: '' } );
		}
	}, [] );

	// Free space if the url is a blob URL → Check if URL is a blog URL after reloading
	useEffect( () => {
		if ( isBlobURL( url ) ) {
			setBlobURL( url );
		} else {
			revokeBlobURL( blobURL );
			setBlobURL( undefined );
		}
	}, [ url ] );

	// Focus on the title field when the image is uploaded/added only
	useEffect( () => {
		if ( url && ! prevURL && isSelected ) {
			titleRef.current.focus();
		}
	}, [ url, prevURL ] );

	// Handling Social Links
	const [ selectedLink, setSelectedLink ] = useState();

	const prevIsSelected = usePrevious( isSelected );

	// Remove
	useEffect( () => {
		if ( ! isSelected && prevIsSelected ) {
			setSelectedLink( undefined );
		}
	}, [ isSelected, prevIsSelected ] );

	const addSocialLink = () => {
		setAttributes( {
			socialLinks: [
				...socialLinks,
				{ link: 'https://gustavohilario.com', icon: 'wordpress' },
			],
		} );

		setSelectedLink( socialLinks.length );
	};

	const onChangeName = ( newName ) => {
		setAttributes( { name: newName } );
	};

	const onChangeBio = ( newBio ) => {
		setAttributes( { bio: newBio } );
	};

	const onSelectImage = ( image ) => {
		if ( ! image || ! image.url ) {
			setAttributes( { url: undefined, id: undefined, alt: '' } );
			return;
		}
		setAttributes( {
			id: image.id,
			url: image.url,
			alt: image.alt,
		} );
	};

	const onChangeImageAlt = ( newAlt ) => {
		setAttributes( { alt: newAlt } );
	};

	const onImageSelectURL = ( newURL ) => {
		setAttributes( { url: newURL, id: undefined, alt: '' } );
	};

	// Update the image size based on the Size (URL) selected
	const onChangeImageSize = ( newSize ) => {
		setAttributes( { url: newSize } );
	};

	const onUploadError = ( message ) => {
		noticeOperations.removeAllNotices();
		noticeOperations.createErrorNotice( message );
	};

	// Handle editing and removing social links
	const deleteSocialLink = () => {
		const newLinks = socialLinks.filter( ( link, index ) => {
			return index !== selectedLink;
		} );

		setAttributes( { socialLinks: newLinks } );
		setSelectedLink( newLinks.length - 1 );
	};

	// Handling
	const editSocialItem = ( type, value ) => {
		const socialLinksCopy = [ ...socialLinks ];
		socialLinksCopy[ selectedLink ][ type ] = value;
		setAttributes( { socialLinks: socialLinksCopy } );
	};

	// Drag and Drop Social Links -- setting up sensors
	const sensors = useSensors(
		useSensor( PointerSensor, {
			activationConstraint: {
				distance: 5,
			},
		} ),
		useSensor( KeyboardSensor )
	);

	const handleDragEnd = ( event ) => {
		const { active, over } = event;

		if ( active && active.id !== over && over.id ) {
			const oldIndex = socialLinks.findIndex(
				( item ) => `${ item.icon }-${ item.link }` === active.id
			);

			const newIndex = socialLinks.findIndex(
				( item ) => `${ item.icon }-${ item.link }` === over.id
			);

			const newSocialLinks = arrayMove( socialLinks, oldIndex, newIndex );

			setAttributes( { socialLinks: newSocialLinks } );
			setSelectedLink( newIndex );
		}
	};

	return (
		<>
			<InspectorControls>
				{ url && ! isBlobURL( url ) && (
					<Panel header="My Panel">
						<PanelBody
							title={ __( 'Image Settings', 'team-members' ) }
							icon="format-image"
							initialOpen={ true }
						>
							<TextareaControl
								label={ __( 'Image Alt Text', 'team-members' ) }
								value={ alt }
								onChange={ onChangeImageAlt }
								help={ __(
									`Alternative text describes your image to people who can’t see it. Add a short description with its key details.`,
									'team-members'
								) }
							></TextareaControl>
							{ id && (
								<SelectControl
									label={ __( 'Image Size', 'team-members' ) }
									onChange={ onChangeImageSize }
									help={ __(
										'Select the image size',
										'team-members'
									) }
									options={ [ ...imageSizeOptions ] }
									value={ url }
								/>
							) }
						</PanelBody>
					</Panel>
				) }
			</InspectorControls>
			{ url && (
				<BlockControls group="inline">
					<ToolbarButton
						icon="trash"
						label={ __( 'Remove Image', 'team-member' ) }
						onClick={ () => {
							setAttributes( {
								id: undefined,
								url: undefined,
								alt: '',
							} );
						} }
						disabled={ ! url }
					/>
					<MediaReplaceFlow
						name={ __( 'Replace Image', 'team-members' ) }
						accept="image/*"
						allowedTypes={ [ 'image' ] }
						mediaURL={ url }
						mediaID={ id }
						onSelect={ onSelectImage }
						onSelectURL={ onImageSelectURL }
						onError={ onUploadError }
					/>
				</BlockControls>
			) }

			<div { ...useBlockProps() }>
				{ url && (
					<div
						className={ `block-team-member-img${
							isBlobURL( url ) ? ' is-loading' : ''
						} ` }
					>
						<img src={ url } alt={ alt } />
						{ isBlobURL( url ) && <Spinner /> }
					</div>
				) }
				<MediaPlaceholder
					accept="image/*"
					allowedTypes={ [ 'image' ] }
					disableMediaButtons={ url }
					icon="admin-users"
					labels={ { title: __( 'The Image' ) } }
					multiple={ false }
					onSelect={ onSelectImage }
					onSelectURL={ onImageSelectURL }
					onError={ onUploadError }
					notices={ noticeUI }
				/>
				{ context && context[ 'blocks-course/team-members-columns' ] }
				<RichText
					ref={ titleRef }
					placeholder={ __( 'Team Member Name', 'team-member' ) }
					tagName="h4"
					className="blocks-course-team-member-name"
					value={ name }
					onChange={ onChangeName }
					allowedFormats={ [] }
				/>
				<RichText
					placeholder={ __( 'Team Member Bio', 'team-member' ) }
					tagName="p"
					className="blocks-course-team-member-bio"
					value={ bio }
					onChange={ onChangeBio }
					allowedFormats={ [] }
				/>
				<div className="blocks-course-team-member-social-links">
					<ul>
						<DndContext
							sensors={ sensors }
							onDragEnd={ handleDragEnd }
							modifiers={ [ restrictToHorizontalAxis ] }
						>
							<SortableContext
								items={ socialLinks.map(
									( item ) => `${ item.icon }-${ item.link }`
								) }
								strategy={ horizontalListSortingStrategy }
							>
								{ socialLinks.map( ( item, index ) => {
									return (
										<SortableItem
											key={ `${ item.icon }-${ item.link }` }
											id={ `${ item.icon }-${ item.link }` }
											index={ index }
											selectedLink={ selectedLink }
											setSelectedLink={ setSelectedLink }
											icon={ item.icon }
										/>
									);
								} ) }
							</SortableContext>
						</DndContext>
						{ isSelected && (
							<li className="blocks-course-team-member-social-links-add">
								<Tooltip
									text={ __(
										'Add Social Link',
										'team-member'
									) }
								>
									<button
										aria-label={ __(
											'Add Social Link',
											'team-member'
										) }
										onClick={ addSocialLink }
									>
										<Icon icon="plus" />
									</button>
								</Tooltip>
							</li>
						) }
					</ul>
				</div>
				{ selectedLink !== undefined && (
					<div className="blocks-course-team-member-social-links-form">
						<TextControl
							label={ __( 'Social Link URL', 'team-member' ) }
							value={
								selectedLink !== undefined
									? socialLinks[ selectedLink ].link
									: ''
							}
							onChange={ ( newLink ) =>
								editSocialItem( 'link', newLink )
							}
						/>

						<TextControl
							label={ __( 'Social Link Icon', 'team-member' ) }
							value={
								selectedLink !== undefined
									? socialLinks[ selectedLink ].icon
									: ''
							}
							onChange={ ( newIcon ) =>
								editSocialItem( 'icon', newIcon )
							}
						/>
						<Flex>
							<FlexItem>
								<Button
									label={ __( 'Delete Link', 'team-member' ) }
									icon="trash"
									variant="secondary"
									onClick={ deleteSocialLink }
								>
									Delete
								</Button>
							</FlexItem>
						</Flex>
					</div>
				) }
			</div>
		</>
	);
}

export default withNotices( Edit );
