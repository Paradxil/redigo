import { useRef, useState, useEffect } from "react";
import createAnimator, { TrackItem } from 'animator';
import { VStack, HStack, ButtonGroup, IconButton, Center } from "@chakra-ui/react";

import {
    FiSmartphone as PhoneIcon,
    FiInstagram as InstagramIcon,
    FiYoutube as YoutubeIcon,
    FiPlay as PlayIcon,
    FiPause as PauseIcon
} from "react-icons/fi";

export const useAnimator = (canvas, objWrapper) => {
    const [animator] = useState(createAnimator());
    const [trackItems, setTrackItems] = useState({});

    const initAnimator = (canvasRef, wrapperRef) => {
        animator.init(canvasRef.current, wrapperRef.current);
    }

    const setTrackItem = (item) => {
        trackItems[item.id] = item;
        setTrackItems({ ...trackItems });
        animator.setTrackItem(item);
    }

    const setInitialTrackItems = (items) => {
        for (let data of items || []) {
            //id, name, type, data, duration, file
            let type = data.file?.type.split('/')[0]||data.type;
            let item = new TrackItem(data.id, data.name, type, data.data, data.duration, data.file.file.url);
            setTrackItem(item);
        }
    }

    const getTrackItem = (id) => {
        animator.getTrackItem(id);
    }

    const play = () => {
        animator.play();
    }

    const pause = () => {
        animator.pause();
    }

    return {
        animator,
        initAnimator,
        play,
        pause,
        setTrackItem,
        setInitialTrackItems,
        getTrackItem,
        trackItems
    }
}

export default function Animator({ play, pause, initAnimator }) {
    const canvasRef = useRef(null);
    const wrapperRef = useRef(null);

    const [canvasH, setCanvasHeight] = useState(400);

    const resizeCanvas = (aspectRatio = 1) => {
        setCanvasHeight(aspectRatio * canvasRef.current.width);
    }

    const resizeCanvasCallback = resizeCanvas.bind(this);

    useEffect(() => {
        //window.addEventListener('resize', resizeCanvasCallback, false);
        resizeCanvas();

        initAnimator(canvasRef, wrapperRef);

        // return () => {
        //     window.removeEventListener('resize', resizeCanvasCallback, false);
        // }
    }, []);

    return (
        <VStack bg='white' p={0} spacing={0} overflow='hidden' shadow={'sm'} w={{base: 'full', lg: '500px'}} rounded={8}>
            <Center ref={wrapperRef} w='100%' onMouseDown={() => { wrapperRef.current.requestFullscreen(); }} onMouseUp={() => { document.exitFullscreen();}}>
                <canvas
                    style={{ width: '100%' }}
                    height={canvasH + 'px'}
                    ref={canvasRef}
                >
                </canvas>
            </Center>
            <HStack p={4} >
                <ButtonGroup isAttached>
                    <IconButton icon={<PlayIcon />} onClick={() => play()} />
                    <IconButton icon={<PauseIcon />} onClick={() => pause()} />
                </ButtonGroup>
                <ButtonGroup isAttached>
                    <IconButton icon={<PhoneIcon />} onClick={() => resizeCanvas(16/9)} />
                    <IconButton icon={<InstagramIcon />} onClick={() => resizeCanvas(1)} />
                    <IconButton icon={<YoutubeIcon />} onClick={() => resizeCanvas(9/16)} />
                </ButtonGroup>
            </HStack>
        </VStack>
    )
}