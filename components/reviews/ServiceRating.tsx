'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Star } from 'lucide-react';

interface RatingData {
    average: number;
    count: number;
}

interface ServiceRatingProps {
    serviceId: string;
    className?: string;
    size?: number;
    showCount?: boolean;
}

interface ResenaRow {
    calificacion: number;
}

export default function ServiceRating({
    serviceId,
    className = '',
    size = 16,
    showCount = true,
}: ServiceRatingProps) {
    const [rating, setRating] = useState<RatingData>({ average: 0, count: 0 });
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const fetchRating = async () => {
            const { data, error } = await supabase
                .from('resenas')
                .select('calificacion')
                .eq('servicio_id', serviceId);

            if (data && !error) {
                // Cast data to ensure TS knows the shape
                const typedData = data as unknown as ResenaRow[];
                const total = typedData.reduce(
                    (acc: number, curr: ResenaRow) => acc + curr.calificacion,
                    0
                );
                const average = typedData.length > 0 ? total / typedData.length : 0;
                setRating({ average, count: typedData.length });
            }
            setLoading(false);
        };

        fetchRating();
    }, [serviceId, supabase]);

    if (loading) return null;
    if (rating.count === 0) return null;

    return (
        <div
            className={`flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 shadow-sm backdrop-blur-sm dark:bg-gray-900/90 ${className}`}
        >
            <Star size={size} className="fill-yellow-400 text-yellow-400" />
            <span className="font-bold text-gray-900 dark:text-white">
                {rating.average.toFixed(1)}
            </span>
            {showCount && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                    ({rating.count})
                </span>
            )}
        </div>
    );
}
