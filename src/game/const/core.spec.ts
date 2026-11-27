import {getAirToGroundAngle, fractionalFill, Matchup} from './core';

describe('core utilities', () => {
    describe('fractionalFill', () => {
        it('returns a filled  array for good true and floor portion of the rate', () => {
            const result = fractionalFill(true, 0.5, 0.25);
            expect(result.length).toBe(1);
        });

        it('adds an extra reaction when the random value falls within the fractional remainder', () => {
            const result = fractionalFill(false, 0.4, 0.25);
            expect(result.length).toBe(2);
        });
        it('doesnt add  an extra reaction when the random value is outside the fractional remainder', () => {
            const result = fractionalFill(false, 0.4, 1);
            expect(result.length).toBe(2);
        });

        it('applies the minimum reactivity value when adjusting the effective rate', () => {
            const result = fractionalFill(true, 0.6, 0.25, 0.5, 0.9);
            expect(result.length).toBe(0);
        });
        it('does not multiply reactivities', () => {
            const result = fractionalFill(true, 0.4, 0.25, 0.5, 0.5);
            expect(result.length).toBe(1);
        });
    });

    describe('getAirToGroundAngle', () => {
        it('returns a zero-angle solution when the horizontal distance is below the tolerance', () => {
            const result = getAirToGroundAngle({ x: 0, y: 0 }, 10, 500, 200, 1000, 50);

            expect(result).toEqual({
                angles: [Math.PI / 2, Math.PI / 2],
                speed: 0
            });
        });

        it('returns a valid angle range and a positive scaled speed for a valid shot', () => {
            const result = getAirToGroundAngle({ x: 0, y: 0 }, 500, 500, 350, 1000, 10);

            expect(result.speed).toBeGreaterThan(0);
            expect(result.angles.length).toBe(2);
            expect(result.angles[0]).toBeDefined()
            expect(result.angles[1]).toBeCloseTo(-Math.PI/4,Math.PI/4)
            expect(result.angles[0]).toBeCloseTo(0,Math.PI/4)
            expect(result.angles[1]).toBeDefined()
            expect(result.angles[1]).toBeLessThan(result.angles[0]);
        });

        it('scales the speed down for close targets and keeps it clamped to a minimum', () => {
            const result = getAirToGroundAngle({ x: 0, y: 0 }, 150, 0, 350, 1000, 10);

            expect(result.speed).toBeLessThan(350);
            expect(result.speed).toBeGreaterThanOrEqual(350 * 0.66);
        });
    });

    describe('matchup', () => {
        it('calcs results for perfect match and scales with damage', () => {
            let result = Matchup(0, 0, 0.1);
            expect(result).toEqual({
                satDelta: 0.2,
                alertDelta: 0,
                mismatchMul: 0
            });

            result = Matchup(0, 0, 0.2);
            expect(result).toEqual({
                satDelta: 0.4,
                alertDelta: 0,
                mismatchMul: 0
            });
        });
        it('calcs results for worst mismatch', () => {
            let m = Matchup(0, 2, 0.3);
            expect(m).toEqual({
                satDelta: 0,
                alertDelta: 0.54,
                mismatchMul: 1
            });
        });
        it('calcs results for medium mismatch', () => {
            let m = Matchup(1, 0, 0.3);
            expect(m).toEqual({
                satDelta: 0.3,
                alertDelta: 0.27,
                mismatchMul: 0.5
            });
        });
    })
});
