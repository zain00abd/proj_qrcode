"use client";

import { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';
import { Button } from '@/components/ui/button';
import { Camera, StopCircle } from 'lucide-react';

interface BarcodeScannerProps {
  onScan: (barcode: string) => void;
}

export default function BarcodeScanner({ onScan }: BarcodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const startScanning = async () => {
    if (!navigator.mediaDevices?.enumerateDevices) {
      console.error('This browser does not support media devices enumeration.');
      return;
    }
  
    if (!readerRef.current) {
      readerRef.current = new BrowserMultiFormatReader();
    }
  
    try {
      setIsScanning(true);
      const videoInputDevices = await readerRef.current.listVideoInputDevices();
  
      if (videoInputDevices.length === 0) {
        console.error('No video input devices found.');
        setIsScanning(false);
        return;
      }
  
      const backCamera = videoInputDevices.find(device =>
        device.label.toLowerCase().includes('back') ||
        device.label.toLowerCase().includes('rear') ||
        device.label.toLowerCase().includes('environment')
      );
  
      const selectedDevice = backCamera ? backCamera.deviceId : videoInputDevices[0].deviceId;
  
      const constraints = {
        video: {
          deviceId: selectedDevice,
          facingMode: backCamera ? 'environment' : 'user',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      };
  
      await readerRef.current.decodeFromVideoDevice(
        selectedDevice,
        videoRef.current!,
        (result) => {
          if (result) {
            onScan(result.getText());
            stopScanning();
          }
        }
      );
    } catch (err) {
      console.error('Error accessing camera:', err);
      setIsScanning(false);
    }
  };
  

  const stopScanning = () => {
    if (readerRef.current) {
      readerRef.current.reset();
      setIsScanning(false);
    }
  };

  useEffect(() => {
    return () => {
      if (readerRef.current) {
        readerRef.current.reset();
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-full max-w-md aspect-video rounded-lg overflow-hidden bg-black">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex gap-2">
        {!isScanning ? (
          <Button onClick={startScanning} className="gap-2">
            <Camera className="w-4 h-4" />
            Start Scanning
          </Button>
        ) : (
          <Button onClick={stopScanning} variant="destructive" className="gap-2">
            <StopCircle className="w-4 h-4" />
            Stop Scanning
          </Button>
        )}
      </div>
    </div>
  );
}