-- The workbook describes the twentieth-century quilted vest, not a Le/Nguyen robe.
-- Correct only the imported value; retain independently curated metadata and sources.
UPDATE cultural_items
SET historical_period = 'Thế kỷ XX (từ năm 1946)'
WHERE name = 'Áo Trấn Thủ' AND historical_period = 'Lê – Nguyễn'
  AND description = 'Áo chẽn không tay, may sát người chần bông hoặc lót vải dày nhằm giữ ấm và tiện cho việc chiến đấu, cử động.';

INSERT INTO cultural_sources (cultural_item_id, title, publisher, url)
SELECT id, 'Chữ và nghĩa: Áo trấn thủ', 'Báo Quân đội nhân dân',
    'https://ct.qdnd.vn/clb-chien-si/chu-va-nghia-ao-tran-thu-527498'
FROM cultural_items item WHERE item.name = 'Áo Trấn Thủ'
  AND NOT EXISTS (SELECT 1 FROM cultural_sources source WHERE source.cultural_item_id = item.id
    AND source.url = 'https://ct.qdnd.vn/clb-chien-si/chu-va-nghia-ao-tran-thu-527498');
