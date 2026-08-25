-- Custom SQL migration file, put your code below! -delete_orphaned_promotion

CREATE TRIGGER delete_orphaned_promotion
AFTER DELETE ON productPromotion
FOR EACH ROW
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM productPromotion
        WHERE promotionId = OLD.promotionId
    ) THEN
        DELETE FROM promotion
        WHERE id = OLD.promotionId;
    END IF;
END;
