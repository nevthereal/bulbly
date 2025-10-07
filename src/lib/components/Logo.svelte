<svg
	xmlns="http://www.w3.org/2000/svg"
	viewBox="-16 -16 160 160"
	width="64"
	height="64"
	class="logo"
>
	<title>Bulbly</title>
	<defs>
		<!-- Gold glass -->
		<radialGradient id="glass-grad" cx="40%" cy="32%" r="65%">
			<stop offset="0%" stop-color="#FFF6CC" />
			<stop offset="30%" stop-color="#FFE38A" />
			<stop offset="65%" stop-color="#FFC23A" />
			<stop offset="100%" stop-color="#FF8C1A" />
		</radialGradient>

		<!-- Inner warm glow -->
		<radialGradient id="inner-glow" cx="50%" cy="50%" r="55%">
			<stop offset="0%" stop-color="#FFF1B8" stop-opacity="0.95" />
			<stop offset="60%" stop-color="#FFC043" stop-opacity="0.35" />
			<stop offset="100%" stop-color="#FF9F2E" stop-opacity="0" />
		</radialGradient>

		<!-- Specular highlight -->
		<radialGradient id="specular" cx="38%" cy="28%" r="22%">
			<stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.9" />
			<stop offset="100%" stop-color="#FFFFFF" stop-opacity="0" />
		</radialGradient>

		<!-- Side streak highlight -->
		<linearGradient id="streak" x1="0" y1="0" x2="1" y2="0">
			<stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.7" />
			<stop offset="100%" stop-color="#FFFFFF" stop-opacity="0" />
		</linearGradient>

		<!-- Outer ambient glow -->
		<radialGradient id="outer-glow" cx="50%" cy="42%" r="60%">
			<stop offset="0%" stop-color="#FFD666" stop-opacity="0.9" />
			<stop offset="60%" stop-color="#FFB84D" stop-opacity="0.35" />
			<stop offset="100%" stop-color="#FFA733" stop-opacity="0" />
		</radialGradient>

		<!-- Metal base -->
		<linearGradient id="metal-grad" x1="0" y1="0" x2="0" y2="1">
			<stop offset="0%" stop-color="#D8DADF" />
			<stop offset="45%" stop-color="#A2A8B1" />
			<stop offset="100%" stop-color="#C9CDD3" />
		</linearGradient>

		<!-- Darker groove for thread edges -->
		<linearGradient id="metal-groove" x1="0" y1="0" x2="0" y2="1">
			<stop offset="0%" stop-color="#7E8690" />
			<stop offset="100%" stop-color="#5B6067" />
		</linearGradient>

		<!-- Copper contact -->
		<linearGradient id="copper-grad" x1="0" y1="0" x2="0" y2="1">
			<stop offset="0%" stop-color="#E7B377" />
			<stop offset="100%" stop-color="#B77A2E" />
		</linearGradient>

		<!-- Filament gradient -->
		<linearGradient id="filament-grad" x1="0" y1="0" x2="1" y2="0">
			<stop offset="0%" stop-color="#FFFFFF" />
			<stop offset="100%" stop-color="#FFD34D" />
		</linearGradient>

		<!-- Soft drop shadow (expanded to avoid clipping) -->
		<filter id="shadow" x="-40%" y="-40%" width="180%" height="180%">
			<feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#000000" flood-opacity="0.25" />
		</filter>

		<!-- Bloom blur for glow (very large region to avoid any clipping) -->
		<filter id="glow-blur" x="-150%" y="-150%" width="400%" height="400%">
			<feGaussianBlur stdDeviation="12" />
		</filter>

		<!-- Enhanced hover glow -->
		<filter id="hover-glow" x="-150%" y="-150%" width="400%" height="400%">
			<feGaussianBlur stdDeviation="18" />
		</filter>

		<!-- Glass clip to keep highlights/face inside -->
		<clipPath id="glass-clip">
			<path
				d="M64 16
           C90 16 108 36 108 60
           C108 72 100 84 88 90
           C82 93 78 98 78 104
           C78 112 71 116 64 116
           C57 116 50 112 50 104
           C50 98 46 93 40 90
           C28 84 20 72 20 60
           C20 36 38 16 64 16 Z"
			/>
		</clipPath>
	</defs>

	<!-- Ambient glow behind the bulb -->
	<circle
		cx="64"
		cy="50"
		r="50"
		fill="url(#outer-glow)"
		filter="url(#glow-blur)"
		class="ambient-glow"
	/>

	<!-- Bulb group with shadow -->
	<g filter="url(#shadow)">
		<!-- Glass bulb -->
		<path
			d="M64 16
         C90 16 108 36 108 60
         C108 72 100 84 88 90
         C82 93 78 98 78 104
         C78 112 71 116 64 116
         C57 116 50 112 50 104
         C50 98 46 93 40 90
         C28 84 20 72 20 60
         C20 36 38 16 64 16 Z"
			fill="url(#glass-grad)"
		/>

		<!-- Highlights and inner glow (clipped to glass) -->
		<g clip-path="url(#glass-clip)">
			<circle cx="64" cy="58" r="36" fill="url(#inner-glow)" />
			<ellipse cx="50" cy="34" rx="14" ry="10" fill="url(#specular)" />
			<rect
				x="28"
				y="28"
				width="22"
				height="54"
				rx="11"
				fill="url(#streak)"
				transform="rotate(-18 39 55)"
				opacity="0.6"
			/>
			<rect
				x="76"
				y="40"
				width="10"
				height="36"
				rx="5"
				fill="#FFFFFF"
				opacity="0.12"
				transform="rotate(14 81 58)"
			/>
		</g>

		<!-- Warm smiley face (on glass, under filament) -->
		<g clip-path="url(#glass-clip)">
			<!-- Eyes -->
			<circle cx="55" cy="50" r="3.2" fill="#7A4D00" />
			<circle cx="73" cy="50" r="3.2" fill="#7A4D00" />
			<!-- Subtle eyelight -->
			<circle cx="54.2" cy="49.2" r="1.2" fill="#FFFFFF" opacity="0.55" />
			<circle cx="72.2" cy="49.2" r="1.2" fill="#FFFFFF" opacity="0.55" />
			<!-- Smile -->
			<path
				d="M54 66 Q64 76 74 66"
				fill="none"
				stroke="#7A4D00"
				stroke-width="3"
				stroke-linecap="round"
			/>
			<!-- Warm blush -->
			<circle cx="49" cy="58" r="2.6" fill="#FFB38A" opacity="0.55" />
			<circle cx="79" cy="58" r="2.6" fill="#FFB38A" opacity="0.55" />
		</g>

		<!-- Filament assembly (drawn above the face) -->

		<!-- Neck collar (top of base) -->
		<rect x="44" y="86" width="40" height="12" rx="6" fill="url(#metal-grad)" />
		<rect x="46" y="88" width="36" height="8" rx="4" fill="#FFFFFF" opacity="0.18" />

		<!-- Threaded metal base -->
		<g>
			<rect x="40" y="96" width="48" height="20" rx="6" fill="url(#metal-grad)" />
			<!-- Thread grooves -->
			<path
				d="M44 100 H84"
				stroke="url(#metal-groove)"
				stroke-width="2.5"
				stroke-linecap="round"
				opacity="0.7"
			/>
			<path
				d="M44 104 H84"
				stroke="url(#metal-groove)"
				stroke-width="2.5"
				stroke-linecap="round"
				opacity="0.75"
			/>
			<path
				d="M44 108 H84"
				stroke="url(#metal-groove)"
				stroke-width="2.5"
				stroke-linecap="round"
				opacity="0.8"
			/>
			<path
				d="M44 112 H84"
				stroke="url(#metal-groove)"
				stroke-width="2.5"
				stroke-linecap="round"
				opacity="0.85"
			/>
			<!-- Base highlights -->
			<rect x="42" y="98" width="44" height="4" rx="2" fill="#FFFFFF" opacity="0.18" />
			<rect x="42" y="108" width="44" height="3" rx="1.5" fill="#FFFFFF" opacity="0.12" />
		</g>

		<!-- Bottom copper contact -->
		<ellipse cx="64" cy="116" rx="10" ry="6" fill="url(#copper-grad)" />
		<ellipse cx="64" cy="115" rx="6" ry="3" fill="#FFFFFF" opacity="0.25" />
	</g>

	<!-- Soft rays -->
	<g stroke-linecap="round" stroke="url(#outer-glow)">
		<line x1="64" y1="6" x2="64" y2="18" stroke-width="3" />
		<line x1="64" y1="118" x2="64" y2="130" stroke-width="2" opacity="0.3" />
		<line x1="20" y1="50" x2="8" y2="50" stroke-width="3" />
		<line x1="120" y1="50" x2="108" y2="50" stroke-width="3" />
		<line x1="32" y1="24" x2="22" y2="14" stroke-width="2.5" />
		<line x1="96" y1="24" x2="106" y2="14" stroke-width="2.5" />
		<line x1="32" y1="76" x2="22" y2="86" stroke-width="2.5" opacity="0.6" />
		<line x1="96" y1="76" x2="106" y2="86" stroke-width="2.5" opacity="0.6" />
	</g>
</svg>

<style>
	.logo {
		transition: all 0.3s ease;
		cursor: pointer;
	}

	.logo:hover {
		filter: drop-shadow(0 0 20px rgba(255, 214, 102, 0.6));
	}

	.logo:hover .ambient-glow {
		filter: url(#hover-glow);
		fill: url(#outer-glow);
		opacity: 1.3;
	}

	@keyframes pulse-glow {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 1.5;
		}
	}

	.logo:hover .ambient-glow {
		animation: pulse-glow 2s ease-in-out infinite;
	}
</style>
