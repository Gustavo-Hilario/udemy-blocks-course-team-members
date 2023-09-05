import {
	useBlockProps,
	InnerBlocks,
	InspectorControls,
} from '@wordpress/block-editor';

import { PanelBody, RangeControl } from '@wordpress/components';

import { __ } from '@wordpress/i18n';

// import { check } from '@wordpress/icons';

import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const { columns } = attributes;

	const onChangeColumns = ( newColumnValue ) => {
		setAttributes( { columns: newColumnValue } );
	};

	return (
		<div
			{ ...useBlockProps( {
				className: `has-${ columns }-columns`,
			} ) }
		>
			<InspectorControls>
				<PanelBody title={ __( 'Team Members' ) }>
					<RangeControl
						label={ __( 'Columns of Team Members' ) }
						value={ columns }
						min={ 1 }
						max={ 6 }
						step={ 1 }
						onChange={ ( newColumnValue ) =>
							onChangeColumns( newColumnValue )
						}
					></RangeControl>
				</PanelBody>
			</InspectorControls>
			<InnerBlocks
				allowedBlocks={ [ 'blocks-course/team-member' ] }
				template={ [
					[ 'blocks-course/team-member' ],
					[ 'blocks-course/team-member' ],
					[ 'blocks-course/team-member' ],
				] }
			/>
		</div>
	);
}
