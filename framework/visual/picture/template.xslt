<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns="http://www.w3.org/1999/xhtml" version="1.0">
    <xsl:output method="xml" omit-xml-declaration="yes"/>
    <xsl:template match="/">
        <figure class="ck-picture">
            <img class="ck-picture__image"/>
            <xsl:if test="/*/@legend">
                <figcaption class="ck-picture__legend">
                    <xsl:value-of select="/*/@legend"/>
                </figcaption>
            </xsl:if>
        </figure>
    </xsl:template>
</xsl:stylesheet>