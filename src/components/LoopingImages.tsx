'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, animate, type MotionValue } from 'framer-motion';
import Image from 'next/image';

const baseImages = [
  '/images/websitepics/T_Q_D_10.jpg',
  '/images/websitepics/T_Q_D_11.jpg',
  '/images/websitepics/T_Q_D_21.jpg',
  '/images/websitepics/T_Q_D_6.jpg',
  '/images/websitepics/T_Q_D_10.jpg',
  '/images/websitepics/T_Q_D_11.jpg',
  '/images/websitepics/T_Q_D_21.jpg',
  '/images/websitepics/T_Q_D_6.jpg',
];

const images = Array.from({ length: 8 }, (_, index) => baseImages[index % baseImages.length]);

export function LoopingImages() {
  const lastIndex = images.length - 1;
  const orbitProgress = useMotionValue(0);
  const [radius, setRadius] = useState(180);
  const orbitScale: MotionValue<number> = useTransform(
    orbitProgress,
    [0, 0.4, 0.5, 0.6, 1],
    [1, 1, 1.35, 1, 1]
  );

  useEffect(() => {
    const media = window.matchMedia('(max-width: 640px)');
    const updateRadius = () => setRadius(media.matches ? 120 : 180);
    updateRadius();
    if (media.addEventListener) {
      media.addEventListener('change', updateRadius);
      return () => media.removeEventListener('change', updateRadius);
    }
    media.addListener(updateRadius);
    return () => media.removeListener(updateRadius);
  }, []);

  useEffect(() => {
    const controls = animate(orbitProgress, 1, {
      repeat: Infinity,
      repeatType: 'loop',
      repeatDelay: 0.6,
      ease: [0.42, 0, 0.58, 1],
      duration: 12,
    });
    return () => controls.stop();
  }, [orbitProgress]);

  return (
    <div className="flex items-center justify-center min-h-[520px] p-4">
      <div className="relative w-[500px] h-[500px] max-w-full">
        {Array.from({ length: images.length }).map((_, index) =>
          index === lastIndex ? null : <Square index={index} key={index} orbitScale={orbitScale} radius={radius} />
        )}

        <Square index={lastIndex} orbitScale={orbitScale} radius={radius}>
          <SquareWithOffset index={0} parentIndex={lastIndex} orbitScale={orbitScale} radius={radius} />
        </Square>
      </div>
    </div>
  );
}

function SquareWithOffset({
  index,
  parentIndex,
  orbitScale,
  radius,
}: {
  index: number;
  parentIndex: number;
  orbitScale: MotionValue<number>;
  radius: number;
}) {
  const image = images[index];
  const firstSquareOffset = useMotionValue(0);

  useEffect(() => {
    const controls = animate(firstSquareOffset, 1, {
      repeat: Infinity,
      repeatType: 'loop',
      repeatDelay: 1,
      ease: [0.42, 0, 0.58, 1],
      duration: 12,
    });
    return () => controls.stop();
  }, [firstSquareOffset]);

  const x = useTransform(
    [firstSquareOffset, orbitScale],
    ([offset, scale]: number[]) => {
      const firstAngle = ((getPathOffset(index) + offset) % 1) * Math.PI * 2;
      const lastAngle = ((getPathOffset(parentIndex) + offset) % 1) * Math.PI * 2;
      return Math.cos(firstAngle) * radius * scale - Math.cos(lastAngle) * radius * scale;
    }
  );

  const y = useTransform(
    [firstSquareOffset, orbitScale],
    ([offset, scale]: number[]) => {
      const firstAngle = ((getPathOffset(index) + offset) % 1) * Math.PI * 2;
      const lastAngle = ((getPathOffset(parentIndex) + offset) % 1) * Math.PI * 2;
      return Math.sin(firstAngle) * radius * scale - Math.sin(lastAngle) * radius * scale;
    }
  );

  return (
    <motion.div className="absolute inset-0 rounded-2xl overflow-hidden" style={{ x, y }}>
      <Image
        src={image}
        alt={`Looping image ${index}`}
        fill
        sizes="150px"
        priority
        className="object-cover"
        draggable={false}
      />
    </motion.div>
  );
}

function Square({
  index,
  children,
  className,
  orbitScale,
  radius,
}: {
  index: number;
  children?: React.ReactNode;
  className?: string;
  orbitScale: MotionValue<number>;
  radius: number;
}) {
  const image = images[index];
  const pathOffset = useMotionValue(getPathOffset(index));

  useEffect(() => {
    const controls = animate(pathOffset, pathOffset.get() + 1, {
      repeat: Infinity,
      repeatType: 'loop',
      repeatDelay: 1,
      ease: [0.42, 0, 0.58, 1],
      duration: 12,
    });
    return () => controls.stop();
  }, [pathOffset]);

  const x = useTransform([pathOffset, orbitScale], ([offset, scale]: number[]) => {
    const angle = (offset % 1) * Math.PI * 2;
    return Math.cos(angle) * radius * scale;
  });

  const y = useTransform([pathOffset, orbitScale], ([offset, scale]: number[]) => {
    const angle = (offset % 1) * Math.PI * 2;
    return Math.sin(angle) * radius * scale;
  });

  return (
    <motion.div
      key={index}
      className={`absolute rounded-lg overflow-hidden w-[150px] h-[150px] ${className ?? ''}`}
      style={{
        left: 'calc(50% - 75px)',
        top: 'calc(50% - 75px)',
        x,
        y,
      }}
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        opacity: { duration: 1, delay: index * 0.12 + 0.35, ease: 'easeOut' },
        scale: { duration: 1, delay: index * 0.12 + 0.35, ease: 'easeOut' },
      }}
    >
      <Image
        src={image}
        alt={`Looping image ${index}`}
        fill
        sizes="160px"
        priority
        className="object-cover"
        draggable={false}
      />
      <motion.div
        className="absolute inset-0 rounded-2xl overflow-hidden"
        initial={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1, delay: index * 0.12 + 0.35, ease: 'easeOut' }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

function getPathOffset(index: number) {
  return index / images.length;
}
